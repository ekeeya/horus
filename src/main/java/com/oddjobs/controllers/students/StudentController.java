package com.oddjobs.controllers.students;
import com.oddjobs.components.ContextProvider;
import com.oddjobs.components.Mapper;
import com.oddjobs.dtos.base.BaseResponse;
import com.oddjobs.dtos.base.ListResponseDTO;
import com.oddjobs.dtos.requests.ApprovalRequestCreateDTO;
import com.oddjobs.dtos.requests.ApprovalRequestDTO;
import com.oddjobs.dtos.requests.BulkStudentLoadRequestDTO;
import com.oddjobs.dtos.requests.StudentRequestDTO;
import com.oddjobs.dtos.responses.StudentResponseDTO;
import com.oddjobs.entities.School;
import com.oddjobs.entities.StudentEntity;
import com.oddjobs.repositories.students.StudentRepository;
import com.oddjobs.services.BackgroundTaskExecutor;
import com.oddjobs.utils.Utils;
import com.oddjobs.dtos.responses.ApprovalRequestResponseDTO;
import com.oddjobs.entities.approvals.ApprovalRequest;
import com.oddjobs.entities.users.ParentUser;
import com.oddjobs.entities.users.SchoolUser;
import com.oddjobs.entities.users.User;
import com.oddjobs.services.schools.ApprovalRequestService;
import com.oddjobs.services.schools.SchoolService;
import com.oddjobs.services.students.StudentService;
import com.oddjobs.services.users.UserService;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/")
public class StudentController {

    private final StudentService studentService;
    private final SchoolService schoolService;
    private final StudentRepository studentRepository;
    private final UserService userService;
    private final ContextProvider contextProvider;
    private final ApprovalRequestService approvalRequestService;
    private final BackgroundTaskExecutor backgroundTaskExecutor;

    private final Mapper mapper;

    @PostMapping("student/register")
    public ResponseEntity<?> registerStudent(
            @RequestBody @Valid StudentRequestDTO request, BindingResult result
    ){
        BaseResponse response =  new BaseResponse(result);
        try{
            if(response.isSuccess()){
                StudentEntity student =  studentService.registerStudent(request);
                response.setData(new StudentResponseDTO(student, true));
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.badRequest().body(response);
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("students")
    public ResponseEntity<?>  fetchStudents(
            @RequestParam(name="schoolId", required = false) Long schoolId,
            @RequestParam(name="classId", required = false) Long classId,
            @RequestParam(name="parentId", required = false) Long parentId,
            @RequestParam(name="name",  required = false) String name,
            @RequestParam(name="page", defaultValue = "0") int page,
            @RequestParam(name="size", defaultValue = "10") int size
    ){
        try{
            List<StudentEntity> students = new ArrayList<>();
            Page<StudentEntity> studentsPage = null;
            User user =  contextProvider.getPrincipal();
            if (name != null){
                name =  name.toLowerCase();
            }
            if(user instanceof  SchoolUser){
                schoolId =  ((SchoolUser) user).getSchool().getId(); // if it's a school user querying set the schoolId right away
            }
            if (user instanceof  ParentUser){
                parentId = user.getId();
            }
            if(schoolId != null && classId != null && name != null){
                students =  studentRepository.searchStudentsBySchoolAndClassAndName(schoolId, classId, name);
            }
            else if(schoolId != null && classId != null){
                studentsPage =  studentService.findStudentBySchoolAndClass(schoolId, classId, page, size);
            }
            else if (schoolId != null && name !=null){
                students = studentRepository.searchStudentsBySchoolAndName(schoolId, name);
            } else if (schoolId !=null) {
                students =  studentService.findBySchool(schoolId, page, size).getContent();
            } else if(name != null){
                students = studentRepository.searchStudentsByName(name);
            }
            else if (parentId !=null) {
                ParentUser parentUser = (ParentUser) userService.findById(parentId);
                students =  parentUser.getStudents();
            }
            else{
                studentsPage = studentService.findAll(page, size);
            }
            int totalPages = 1;
            if(studentsPage != null){
                students =  studentsPage.getContent();
                totalPages=studentsPage.getTotalPages();
            }
            List<StudentResponseDTO> sl =  students.stream().map(r-> mapper.toStudentDTO(r, true)).toList();
            ListResponseDTO<StudentResponseDTO> response = new ListResponseDTO<>(sl, totalPages);
            response.setOffset(page);
            response.setLimit(size);
            return ResponseEntity.ok(response);
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/get-student/{studentId}")
    public ResponseEntity<?> getStudent(
            @PathVariable(name="studentId") Long studentId
    ){
        try{
            BaseResponse response = new BaseResponse();
            StudentEntity student =  studentService.findById(studentId);
            StudentResponseDTO s =  mapper.toStudentDTO(student, true);
            response.setData(s);
            return ResponseEntity.ok(response);
        }catch (Exception e){
            log.error(e.getMessage(),e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/get-approval-requests")
    @Secured({"ROLE_SCHOOL", "ROLE_PARENT","ROLE_ADMIN"})
    public ResponseEntity<?> getLinkApprovalRequest(
            @RequestParam(name="parentId", required = false) Long parentId,
            @RequestParam(name="school", required = false) Long schoolId,
            @RequestParam(name="mine", defaultValue = "false") boolean mine,
            @RequestParam(name="status", defaultValue = "PENDING") ApprovalRequest.Status status,
            @RequestParam(name="page", defaultValue = "0") int page,
            @RequestParam(name="size", defaultValue = "10") int size
    ){
        try{
            ListResponseDTO<ApprovalRequestResponseDTO> response;
            Page<? extends ApprovalRequest> requests;

            User u = contextProvider.getPrincipal();

            if(u instanceof SchoolUser su){
                schoolId = su.getSchool().getId();
            }
            if (u instanceof  ParentUser parentUser){
                parentId = parentUser.getId();
            }
            if(schoolId != null){
                requests = approvalRequestService.findPrimaryParentApprovalRequestsBySchool(schoolId,status, page, size);
            }
            else if(mine){
                // find ones I requested for
                assert u instanceof ParentUser;
                ParentUser user = (ParentUser) u;
                requests =  approvalRequestService.findMyRequests(user.getId(),status,page,size);
            }
            else if(parentId != null){
                requests =  approvalRequestService.findSecondaryParentApprovalRequestsByParent(parentId,status, page, size);
            }
            else{
                requests = approvalRequestService.findByStatus(status, page, size);
            }
            List<ApprovalRequestResponseDTO> all = requests.getContent().stream().map(ApprovalRequestResponseDTO::new).toList();
            response =  new ListResponseDTO<>(all, requests.getTotalPages());
            return ResponseEntity.ok().body(response);

        }catch (Exception e){
            log.error(e.getMessage(),e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/request-student-link")
    @Secured({"ROLE_PARENT"})
    public ResponseEntity<?> requestStudentLink(
            @RequestBody ApprovalRequestCreateDTO request
            ){
        try{
            ParentUser user = (ParentUser) contextProvider.getPrincipal();
            // check if user has a primary parent;
            StudentEntity student = studentService.findById(request.getStudentId());
            ParentUser primaryParent = student.getPrimaryParent();
            if (primaryParent==null){
                request.setType(Utils.APPROVAL_TYPES.SCHOOL_APPROVAL);
                request.setParent(user.getId());
            }else{
                request.setType(Utils.APPROVAL_TYPES.PARENT_APPROVAL);
                request.setParent(primaryParent.getId());
                request.setSecondaryParentId(user.getId());
            }
            ApprovalRequest approvalRequest =  approvalRequestService.createApprovalRequest(request, false);
            BaseResponse response =  new BaseResponse();
            response.setData(new ApprovalRequestResponseDTO(approvalRequest));
            return ResponseEntity.ok(response);
        }catch (Exception e){
            log.error(e.getMessage(),e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
    @PostMapping("approve-parent-child-link")
    @Secured({"ROLE_SCHOOL", "ROLE_PARENT","ROLE_ADMIN"})
    public ResponseEntity<?> approveLinkRequest(
            @RequestBody ApprovalRequestDTO payload
            ){
        try{
            List<ApprovalRequest> request = approvalRequestService.approveParentStudentLinkRequest(payload);
            List<ApprovalRequestResponseDTO> l =  request.stream().map(ApprovalRequestResponseDTO::new).toList();
            ListResponseDTO<ApprovalRequestResponseDTO> response = new ListResponseDTO<>(l, 1);
            return ResponseEntity.ok().body(response);
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("bulky-load-students/{schoolId}")
    @Secured({"ROLE_ADMIN", "ROLE_SCHOOL"})
    public ResponseEntity<?> bulkLoadStudents(
            @PathVariable(name="schoolId") Long schoolId,
            @RequestParam(value = "file", required = false) MultipartFile file
    ){
        try{
            School school =  schoolService.findById(schoolId);
            User u =  contextProvider.getPrincipal();
            if (u instanceof  SchoolUser){
                if (!((SchoolUser) u).getSchool().equals(school)){
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have enough permission carry out this action");
                }
            }
            try (Reader reader = new BufferedReader(new InputStreamReader((file.getInputStream())))) {
                CsvToBean<BulkStudentLoadRequestDTO> csvToBean = new CsvToBeanBuilder<BulkStudentLoadRequestDTO>(reader)
                        .withType(BulkStudentLoadRequestDTO.class)
                        .withIgnoreLeadingWhiteSpace(true)
                        .withIgnoreEmptyLine(true)
                        .build();
                try {
                    List<BulkStudentLoadRequestDTO> bulkStudents =  csvToBean.parse();
                    Runnable runnable = () -> {
                        try {
                            for (BulkStudentLoadRequestDTO importData: bulkStudents ) {
                                try{
                                    studentService.registerStudentViaBulk(importData, schoolId);
                                }catch (Exception e){
                                    String error = String.format("Failed to record student due to: %s %s", e.getMessage(), importData);
                                    log.error(e.getMessage(), error);
                                }
                            }
                            log.debug(String.format("%s students have been loaded in bulk for school %s", bulkStudents.size(), school.getName()));
                            // TODO send email as well to admin
                        } catch (Exception e) {
                            log.error(e.getMessage(),e);
                            throw new RuntimeException(e);
                        }
                    };
                    backgroundTaskExecutor.runTask(runnable);
                    BaseResponse response =  new BaseResponse();
                    response.setMessage(String.format("We shall attempt load %s students for school %s", bulkStudents.size(),school.getName()));
                    return  ResponseEntity.ok(response);
                } catch (Exception e) {
                    log.error(e.getMessage(), e);
                    List<String> fields = List.of("first_name","last_name","middle_name","class");
                    String message = String.format("Required field(s) is missing in the CSV data. Make sure csv is %s", fields);
                    return ResponseEntity.badRequest().body(message);
                }
            } catch (IOException e) {
                log.error(e.getMessage(),e);
                return ResponseEntity.internalServerError().body(e.getMessage());
            }
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return  ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

}
