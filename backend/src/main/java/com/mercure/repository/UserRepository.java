package com.mercure.repository;

import com.mercure.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    UserEntity getUserByFirstNameOrMail(String firstName, String mail);

    @Query(value = "SELECT u.firstname, u.lastname FROM user u WHERE u.id = :userId", nativeQuery = true)
    String getUsernameByUserId(@Param(value = "userId") int id);

    @Query(value = "SELECT u.firstname FROM user u WHERE u.id = :userId", nativeQuery = true)
    String getFirstNameByUserId(@Param(value = "userId") int id);

    @Query(value = "SELECT u.firstname FROM user u WHERE u.wstoken = :token", nativeQuery = true)
    String getUsernameWithWsToken(@Param(value = "token") String token);

    @Query(value = "SELECT u.id FROM user u WHERE u.wstoken = :token", nativeQuery = true)
    int getUserIdWithWsToken(@Param(value = "token") String token);

    @Query(value = "SELECT * FROM user u WHERE u.id NOT IN :ids", nativeQuery = true)
    List<UserEntity> getAllUsersNotAlreadyInConversation(@Param(value = "ids") int[] ids);

    int countAllByFirstNameOrMail(String firstName, String mail);

    int countAllByShortUrl(String shortUrl);
}
