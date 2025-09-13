package com.bettercallxiaojin.home.service.impl;

import com.bettercallxiaojin.home.common.BaseContext;
import com.bettercallxiaojin.home.common.util.PageQueryUtil;
import com.bettercallxiaojin.home.mapper.FollowMapper;
import com.bettercallxiaojin.home.mapper.UserMapper;
import com.bettercallxiaojin.home.pojo.VO.SimpleUserVO;
import com.bettercallxiaojin.home.pojo.entity.User;
import com.bettercallxiaojin.home.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FollowServiceImpl implements FollowService {

    private final UserMapper userMapper;
    private final FollowMapper followMapper;

    @Override
    public void follow(String followId) {
        String userId = BaseContext.getUserId();
        User user = userMapper.selectById(userId);
        User followedUser = userMapper.selectById(followId);

        if (followedUser == null) {
            throw new RuntimeException("followee is null");
        }
        if (user == null) {
            throw new RuntimeException("User is null");
        }
        if (followMapper.existsByUserIdAndFollowId(userId, followId)) {
            throw new RuntimeException("Already follow");
        }

        try {
            userMapper.updateFollower(followedUser.getFollowerCount() + 1, followId);
            userMapper.updateFollowing(user.getFollowingCount() + 1, userId);
        } catch (Exception e) {
            throw new RuntimeException("update follower error: " + e.getMessage());
        }

        try {
            followMapper.follow(userId, followId);
        } catch (Exception e) {
            throw new RuntimeException("follow error: " + e.getMessage());
        }

    }

    @Override
    public void unfollow(String followId) {
        String userId = BaseContext.getUserId();
        User user = userMapper.selectById(userId);
        User followedUser = userMapper.selectById(followId);

        if (followedUser == null) {
            throw new RuntimeException("followee is null");
        }
        if (user == null) {
            throw new RuntimeException("User is null");
        }
        if (!(followMapper.existsByUserIdAndFollowId(userId, followId))) {
            throw new RuntimeException("Not followed");
        }

        try {
            userMapper.updateFollower(followedUser.getFollowerCount() - 1, followId);
            userMapper.updateFollowing(user.getFollowingCount() - 1, userId);
        } catch (Exception e) {
            throw new RuntimeException("update follower error: " + e.getMessage());
        }

        try {
            followMapper.unfollow(userId, followId);
        } catch (Exception e) {
            throw new RuntimeException("follow error: " + e.getMessage());
        }
    }

    @Override
    public Boolean checkFollowStatus(String followId) {
        String userId = BaseContext.getUserId();

        boolean exists = followMapper.existsByUserIdAndFollowId(userId, followId);
        return exists;
    }

    @Override
    public List<SimpleUserVO> getFollowingList(String pageNum, String pageSize) {
        String userId = BaseContext.getUserId();

        List<SimpleUserVO> followingList = followMapper.selectFollowingByUserId(userId);

        return PageQueryUtil.paginate(followingList, pageNum, pageSize);
    }

    @Override
    public List<SimpleUserVO> getFollowerList(String pageNum, String pageSize) {
        String userId = BaseContext.getUserId();

        List<SimpleUserVO> followerList = followMapper.selectFollowerByUserId(userId);

        return PageQueryUtil.paginate(followerList, pageNum, pageSize);    }
}
