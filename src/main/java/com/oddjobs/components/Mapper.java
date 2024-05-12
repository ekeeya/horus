package com.oddjobs.components;

import com.oddjobs.dtos.responses.*;
import com.oddjobs.entities.users.*;
import com.oddjobs.entities.wallets.SchoolCollectionAccount;
import com.oddjobs.repositories.school.ClassRoomRepository;
import com.oddjobs.entities.ClassRoom;
import com.oddjobs.entities.School;
import com.oddjobs.entities.StudentEntity;
import com.oddjobs.repositories.students.StudentRepository;
import com.oddjobs.repositories.transactions.CollectionTransactionRepository;
import com.oddjobs.repositories.transactions.PaymentTransactionRepository;
import com.oddjobs.services.students.StudentService;
import com.oddjobs.services.wallet.WalletService;
import com.oddjobs.utils.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Component
@RequiredArgsConstructor
public class Mapper {

    private final StudentRepository studentRepository;
    private final ClassRoomRepository classRoomRepository;
    private final WalletService walletService;
    private final PaymentTransactionRepository paymentTransactionRepo;
    private final CollectionTransactionRepository collectionTransactionRepo;


    public UserResponseDto toUserDTO(User user, boolean showPerms) {
        UserResponseDto userDto = new UserResponseDto(user, showPerms);
        switch (user.getAccountType()) {
            case POS -> {
                POSAttendant u = (POSAttendant) user;
                userDto = new PosUserDTO(user);
                if(u.getPosCenter() !=null){
                    ((PosUserDTO) userDto).setPosCenter(new PosCenterResponseDTO(u.getPosCenter(), false));
                }
            }
            case PARENT -> {
                ParentUser u = (ParentUser) user;
                userDto = new ParentUserDTO(user);
                userDto.setTotalContributions(collectionTransactionRepo.sumCollectionsByParentAndStatus(u, Utils.TRANSACTION_STATUS.SUCCESS));
                List<StudentEntity> students =studentRepository.findStudentEntitiesByParentsContaining(u);
                students =  students!=null ? students: new ArrayList<>();
                List<StudentResponseDTO> sl = students.stream().map(r-> new StudentResponseDTO(r, true)).toList();
                ((ParentUserDTO) userDto).setStudents(sl);
            }
            case SCHOOL_ADMIN -> {
                SchoolUser u = (SchoolUser) user;
                userDto = new SchoolUserDTO(u);
                if(((SchoolUserDTO) userDto).getSchool() ==null || ((SchoolUserDTO) userDto).getSchool().getClasses().size() < 1){
                    School s = ((SchoolUser) user).getSchool();
                    SchoolResponseDTO sr =  toSchoolDto(s);
                    ((SchoolUserDTO) userDto).setSchool(sr);
                }
            }
        }
        return userDto;
    }

    public ProspectResponseDto toProspectUserDTO(Prospect user) {
        return new ProspectResponseDto(user);
    }


    public StudentResponseDTO toStudentDTO(StudentEntity student, boolean showWallet)  {
        StudentResponseDTO dto = new StudentResponseDTO(student, showWallet);
        WalletResponseDTO w = new WalletResponseDTO(student.getWalletAccount(), paymentTransactionRepo, collectionTransactionRepo);
        dto.setWallet(w);
        if(student.getParents() !=null && student.getParents().size() > 0){
            List<ParentUser> contributors = student.getParents();
            List<UserResponseDto> parents = contributors.stream().map(r->new UserResponseDto(r, false)).toList();
            for (UserResponseDto parent:parents) {
                if (parent.getId().equals(student.getPrimaryParent().getId())){
                    parent.setPrimary(true);
                    break;
                }
            }
            dto.setContributors(parents);
        }
        return dto;
    }

    public SchoolResponseDTO toSchoolDto(School school){
        SchoolResponseDTO dto =  new SchoolResponseDTO(school);
        SchoolCollectionAccount acc =  walletService.findWalletBySchool(school);
        dto.setAccountId(acc.getId());
        dto.setAccountBalance(acc.getBalance().doubleValue());
        if (dto.getClasses().size() == 0){
            List<ClassRoom> rooms =  classRoomRepository.findClassRoomsBySchoolOrderByNameDesc(school);
            if(rooms !=null){
                rooms.sort(Comparator.comparing(ClassRoom::getName));
                List<ClassRoomResponseDTO> classes =  rooms.stream().map(ClassRoomResponseDTO::new).toList();
                dto.setClasses(classes);
            }
        }
        return  dto;
    }

}
