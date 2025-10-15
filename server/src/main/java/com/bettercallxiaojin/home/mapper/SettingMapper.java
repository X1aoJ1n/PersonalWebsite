package com.bettercallxiaojin.home.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SettingMapper {

    @Insert("INSERT INTO notification (user_id) VALUES (#{userId})")
    void initByUserId(String userId);
}
