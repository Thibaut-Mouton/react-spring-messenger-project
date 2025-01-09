package com.mercure.core.service;

import com.mercure.commons.dto.GroupMemberDTO;
import com.mercure.commons.entity.GroupRoleKey;
import com.mercure.commons.entity.GroupUser;
import com.mercure.commons.entity.UserEntity;
import com.mercure.core.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.*;

@Service
@Getter
@Setter
@AllArgsConstructor
public class UserService {

//    private PasswordEncoder passwordEncoder;

    private UserRepository userRepository;

    private GroupUserJoinService groupUserJoinService;

    private static Map<Integer, String> wsSessions = new HashMap<>();

    public List<UserEntity> findAll() {
        return userRepository.findAll();
    }

    @Transactional
    public void save(UserEntity userEntity) {
        userRepository.save(userEntity);
    }

    public List<GroupMemberDTO> fetchAllUsers(int[] ids) {
        List<GroupMemberDTO> toSend = new ArrayList<>();
        List<UserEntity> list = userRepository.getAllUsersNotAlreadyInConversation(ids);
        list.forEach(user -> toSend.add(new GroupMemberDTO(user.getId(), user.getFirstName(), user.getLastName(), false)));
        return toSend;
    }

    public UserEntity findByNameOrEmail(String str0, String str1) {
        return userRepository.getUserByFirstNameOrMail(str0, str1);
    }

    public boolean checkIfUserIsAdmin(int userId, int groupIdToCheck) {
        GroupRoleKey id = new GroupRoleKey(groupIdToCheck, userId);
        Optional<GroupUser> optional = groupUserJoinService.findById(id);
        if (optional.isPresent()) {
            GroupUser groupUser = optional.get();
            return groupUser.getRole() == 1;
        }
        return false;
    }

    public String createShortUrl(String firstName, String lastName) {
        StringBuilder sb = new StringBuilder();
        sb.append(firstName);
        sb.append(".");
        sb.append(Normalizer.normalize(lastName.toLowerCase(), Normalizer.Form.NFD));
        boolean isShortUrlAvailable = true;
        int counter = 0;
        while (isShortUrlAvailable) {
            sb.append(counter);
            if (userRepository.countAllByShortUrl(sb.toString()) == 0) {
                isShortUrlAvailable = false;
            }
            counter++;
        }
        return sb.toString();
    }

    public String findUsernameById(int id) {
        return userRepository.getUsernameByUserId(id);
    }

    public String findFirstNameById(int id) {
        return userRepository.getFirstNameByUserId(id);
    }

    public UserEntity findById(int id) {
        return userRepository.findById(id).orElse(null);
    }

    public String passwordEncoder(String str) {
//        return passwordEncoder.encode(str);
        return str;
    }

    public boolean checkIfUserNameOrMailAlreadyUsed(String mail) {
        return userRepository.countAllByMail(mail) > 0;
    }
}
