package com.oddjobs.services.users;

import com.oddjobs.dtos.requests.ProspectRequestDto;
import com.oddjobs.dtos.requests.UserRequestDto;
import com.oddjobs.exceptions.PosCenterNotFoundException;
import com.oddjobs.exceptions.SchoolNotFoundException;
import com.oddjobs.exceptions.UserNameAlreadyExists;
import com.oddjobs.utils.Utils;
import com.oddjobs.entities.users.POSAttendant;
import com.oddjobs.entities.users.ParentUser;
import com.oddjobs.entities.users.User;
import com.oddjobs.entities.users.Prospect;
import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {

    User registerOrUpdateUser(UserRequestDto user) throws UserNameAlreadyExists;
    Prospect register(ProspectRequestDto prospectUser);
    User findByUsername(String username);
    Page<? extends User> findUsersByAccountType(Utils.ACCOUNT_TYPE accountType, int page, int size);
    User findById(Long id);
    Page<User> findAllUsers(int page, int size);
    Page<POSAttendant> findUsersByPosCenter(Long posId, int page, int size) throws PosCenterNotFoundException;
    Page<? extends User> findUsersBySchool(Long schoolId, int page, int size) throws SchoolNotFoundException;
    Page<ParentUser> searchParentsByName(String name, int page, int size);
    User accountManagement(Utils.ACCOUNT_ACTIONS action, Long id) throws Exception;

    Page<ParentUser> findParentsBySchool(Long schoolId, int page, int size) throws SchoolNotFoundException; // Hmm! (call me and ask why I added a "hmm!")

}
