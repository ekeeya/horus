package com.oddjobs.services.users;

import com.oddjobs.components.ContextProvider;
import com.oddjobs.dtos.requests.UserRequestDto;
import com.oddjobs.entities.PosCenterEntity;
import com.oddjobs.entities.School;
import com.oddjobs.entities.users.*;
import com.oddjobs.exceptions.PosCenterNotFoundException;
import com.oddjobs.exceptions.ResourceFobidenException;
import com.oddjobs.exceptions.SchoolNotFoundException;
import com.oddjobs.exceptions.UserNameAlreadyExists;
import com.oddjobs.repositories.pos.PosCenterRepository;
import com.oddjobs.repositories.school.SchoolRepository;
import com.oddjobs.repositories.users.POSUserRepository;
import com.oddjobs.repositories.users.ParentUserRepository;
import com.oddjobs.repositories.users.UserRepository;
import com.oddjobs.utils.Utils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;


@Transactional
@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final POSUserRepository posUserRepository;
    private final ParentUserRepository parentUserRepository;
    private final PosCenterRepository posCenterRepository;
    private final SchoolRepository schoolRepository;
    private final ContextProvider contextProvider;


    private final PasswordEncoder passwordEncoder;

    // private  final SecretGenerator secretGenerator;

    protected boolean hasPosReadRights(PosCenterEntity posCenter){
        User user = contextProvider.getPrincipal();
        if(user instanceof SchoolUser){
            List<PosCenterEntity> posCenters = posCenterRepository.findPosCenterEntitiesBySchool(((SchoolUser) user).getSchool());
            if (!posCenters.contains(posCenter)){
                log.warn(String.format("User %s has no permission to retrieve pos Center ID %s", user.getUsername(),posCenter.getName()));
                return false;
            }
        }
        return true;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = findByUsername(username);
        if (user == null){
            log.error("User not found");
            throw new UsernameNotFoundException(username);
        }
        return user;
    }

    @Override
    public User registerOrUpdateUser(UserRequestDto request) throws UserNameAlreadyExists {

        User user;
        if (request.getId() != null){
            user =  findById(request.getId());
            // When updating..
            if(request.getPassword() != null){
                user.setPassword(passwordEncoder.encode(request.getPassword()));
            }
        }
        else{
            if (userRepository.existsByUsername(request.getUsername())){
                throw  new UserNameAlreadyExists(request.getUsername());
            }
            switch (request.getAccountType()){
                case PARENT -> {
                    user =  new ParentUser();
                    // check  if School User is registering them.
                    User u =  contextProvider.getPrincipal();
                    if(u instanceof SchoolUser){
                        ((ParentUser)  user).setSchool(((SchoolUser) u).getSchool());
                    }
                }
                case POS -> {
                    user =  new POSAttendant();
                    // School school = schoolRepository.findById(request.getSchoolId()).get();
                    PosCenterEntity  pos = posCenterRepository.findById(request.getPosCenterId()).get();
                    ((POSAttendant) user).setPosCenter(pos);
                }
                case SCHOOL_ADMIN -> {
                    user =  new SchoolUser();
                    School  school = schoolRepository.findById(request.getSchoolId()).get();
                    ((SchoolUser) user).setDepartment(request.getDepartment());
                    ((SchoolUser) user).setSchool(school);
                    user.setIsSuperAdmin(true);
                }
                default -> {
                    user =  new AdminUser();
                    user.setIsSuperAdmin(true);
                }
            }
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        user.setAddress(request.getAddress());
        user.setGender(request.getGender());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setFirstName(request.getFirstName());
        user.setAccountType(request.getAccountType());
        user.setUsername(request.getUsername());
        user.setLastName(request.getLastName());
        user.setTelephone(request.getTelephone());
        user.setMiddleName(request.getMiddleName());
        user.setUsing2FA(request.isUsing2fa());
        //user.setIsSuperAdmin(request.isSuperUser());
        return userRepository.save(user);
    }


    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Page<User> findUsersByAccountType(Utils.ACCOUNT_TYPE accountType, int page, int size) {
        Pageable pageable =  PageRequest.of(page, size, Sort.by("id").descending());
        return userRepository.findByAccountType(accountType, pageable);
    }

    @Override
    public User findById(Long id) {
        try{
            User user = contextProvider.getPrincipal();
            User u = userRepository.findById(id).get();
            if (!Objects.equals(user.getId(), u.getId()) && user instanceof  SchoolUser){
                if(u instanceof  SchoolUser || u instanceof AdminUser){
                    throw new ResourceFobidenException(String.format("User %s is forbidden from seeing details of user %s", user, u));
                }
            }
            return u;
        }catch (NoSuchElementException e){
            throw new EntityNotFoundException();
        } catch (ResourceFobidenException e) {
            throw new RuntimeException(e);
        }
    }
    @Override
    public Page<User> findAllUsers(int page, int size) {
        Pageable pageable =  PageRequest.of(page, size, Sort.by("id").descending());
        return userRepository.findAll(pageable);
    }

    @Override
    public Page<POSAttendant>findUsersByPosCenter(Long posId, int page, int size) throws PosCenterNotFoundException {
        Pageable pageable =  PageRequest.of(page, size, Sort.by("id").descending());
        try{
            PosCenterEntity posCenter = posCenterRepository.findById(posId).get(); // throws an exception
            if(hasPosReadRights(posCenter)){
                return posUserRepository.findAllByPosCenter(posCenter, pageable);
            }
            throw new ResourceFobidenException(String.format("User has no permission to retrieve pos Center ID %s",posCenter.getName()));
        }catch (NoSuchElementException e){
            log.error(e.getMessage(), e);
            throw  new PosCenterNotFoundException(posId);
        } catch (ResourceFobidenException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Page<? extends User> findUsersBySchool(Long schoolId, int page, int size) throws SchoolNotFoundException {
        Pageable pageable =  PageRequest.of(page, size, Sort.by("id").descending());
        try{
            School school = schoolRepository.findById(schoolId).get(); // throws an exception
            return userRepository.findUsersBySchool(school, pageable);
        }catch (NoSuchElementException e){
            log.error(e.getMessage(), e);
            throw  new SchoolNotFoundException(schoolId);
        }
    }

    @Override
    public Page<ParentUser> searchParentsByName(String name, int page, int size) {
        Pageable pageable =  PageRequest.of(page, size, Sort.by("id").descending());
        return parentUserRepository.searchStudentsByName(name, pageable);
    }

    @Override
    public User accountManagement(Utils.ACCOUNT_ACTIONS action, Long id) throws Exception {
        User user =  findById(id);
        if (user == null){
            throw  new Exception(String.format("No user account with id: %s found", id));
        }
        switch (action){
            case Enable -> {
                user.setEnabled(true);
                user.setIsExpired(false);
                user.setDeleted(false);
            }
            case Delete -> {
                user.setDeleted(true);
                user.setEnabled(false);
                user.setIsExpired(true);
            }
            default -> {
                user.setEnabled(false);
            }
        }
        return userRepository.save(user);
    }

    @Override
    public Page<ParentUser> findParentsBySchool(Long schoolId, int page, int size) throws SchoolNotFoundException {
        try{
            User user = contextProvider.getPrincipal();
            if(user instanceof SchoolUser){
                if (!((SchoolUser) user).getSchool().getId().equals(schoolId)){
                    schoolId = ((SchoolUser) user).getSchool().getId();
                }
            }
            School school =  schoolRepository.findById(schoolId).get();
            Pageable pageable =  PageRequest.of(page, size, Sort.by("id").descending());
            return parentUserRepository.findParentUsersBySchool(school, pageable);
        }catch (NoSuchElementException e){
            throw new SchoolNotFoundException(schoolId);
        }
    }
}
