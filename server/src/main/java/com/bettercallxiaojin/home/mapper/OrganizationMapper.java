package com.bettercallxiaojin.home.mapper;

import com.bettercallxiaojin.home.pojo.entity.Organization;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface OrganizationMapper {

    @Select("SELECT * FROM organization WHERE user_id = #{userId}")
    List<Organization> selectByUserId(@Param("userId") String userId);
}
