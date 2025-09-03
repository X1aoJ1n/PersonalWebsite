package com.bettercallxiaojin.home.mapper;

import com.bettercallxiaojin.home.pojo.entity.Organization;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface OrganizationMapper {

    @Select("SELECT * FROM organization WHERE user_id = #{userId}")
    List<Organization> selectByUserId(@Param("userId") String userId);

    @Select("SELECT * FROM organization WHERE id = #{id}")
    Organization selectById(String id);

    @Insert("INSERT INTO organization (id, user_id, type, name, start_date, end_date, position, description) " +
            "VALUES (#{id}, #{userId}, #{type}, #{name}, #{startDate}, #{endDate}, #{position}, #{description})")
    int insert(Organization organization);

    @Update("UPDATE organization set type = #{type}, name = #{name}, start_date = #{startDate}, end_date = #{endDate}, position = #{position}, description = #{description} WHERE id = #{id}")
    int update(Organization organization);
}
