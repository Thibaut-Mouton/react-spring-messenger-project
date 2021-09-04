package com.mercure.service;

import com.mercure.dto.GroupMemberDTO;
import com.mercure.dto.UserDTO;
import com.mercure.entity.GroupRoleKey;
import com.mercure.entity.GroupUser;
import com.mercure.entity.UserEntity;
import com.mercure.mapper.UserMapper;
import com.mercure.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.text.Normalizer;
import java.util.*;

@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupUserJoinService groupUserJoinService;

    private Map<Integer, String> wsSessions = new HashMap<>();

    public Map<Integer, String> getWsSessions() {
        return wsSessions;
    }

    public void setWsSessions(Map<Integer, String> wsSessions) {
        this.wsSessions = wsSessions;
    }

    public void deleteAll() {
        userRepository.deleteAll();
    }

    public void flush() {
        userRepository.flush();
    }

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

    public String findUsernameWithWsToken(String token) {
        return userRepository.getUsernameWithWsToken(token);
    }

    public int findUserIdWithToken(String token) {
        return userRepository.getUserIdWithWsToken(token);
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
        return passwordEncoder.encode(str);
    }

    public boolean checkIfUserNameOrMailAlreadyUsed(String firstName, String mail) {
        return userRepository.countAllByFirstNameOrMail(firstName, mail) > 0;
    }


    /**
     * At WebSocket init, fetch user data and map it to a {@link UserDTO}
     *
     * @param username string value for username
     * @return a {@link UserDTO}
     */
    @Transactional
    public UserDTO getUserInformation(String username) {
        UserEntity userEntity = findByNameOrEmail(username, username);
        return userMapper.toUserDTO(userEntity);
    }
}
