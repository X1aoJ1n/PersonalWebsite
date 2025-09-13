package com.bettercallxiaojin.home.controller;

import com.bettercallxiaojin.home.common.BaseContext;
import com.bettercallxiaojin.home.pojo.DTO.AddContactDTO;
import com.bettercallxiaojin.home.pojo.DTO.ContactDTO;
import com.bettercallxiaojin.home.pojo.VO.ContactVO;
import com.bettercallxiaojin.home.pojo.VO.OrganizationVO;
import com.bettercallxiaojin.home.pojo.entity.Response;
import com.bettercallxiaojin.home.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/contact")
@RequiredArgsConstructor
@Tag(name = "联系方式管理", description = "联系方式相关接口")
public class ContactController {

    private final ContactService contactService;

    @PostMapping("/add")
    @Operation(summary = "添加新联系方式")
    public Response<List<ContactVO>> addContact(@Valid @RequestBody AddContactDTO addContactDTO) {

        try {
            List<ContactVO> contacts = contactService.addContact(
                    addContactDTO.getType(),
                    addContactDTO.getData()
            );
            return Response.success(contacts);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }


    @GetMapping("/{id}")
    @Operation(summary = "根据id获取联系方式")
    public Response<ContactVO> getContactById(@PathVariable String id) {
        if (id == null || id.isEmpty()) {
            return Response.error("id is empty or null");
        }
        try {
            ContactVO contactVO = contactService.getContactById(id);
            return Response.success(contactVO);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @GetMapping("/user")
    @Operation(summary = "根据用户id获取联系方式")
    public Response<List<ContactVO>> getContactByUserId(@RequestParam String userId) {
        if (userId == null || userId.isEmpty()) {
            userId = BaseContext.getUserId();
        }
        try {
            List<ContactVO> contactVOS = contactService.getContactByUserId(userId);
            return Response.success(contactVOS);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @PutMapping("/update")
    @Operation(summary = "修改联系方式信息")
    public Response<List<ContactVO>> updateContactById(@Valid @RequestBody ContactDTO contactDTO) {


        try {
            List<ContactVO> contactVOS = contactService.updateContact(
                    contactDTO.getId(),
                    contactDTO.getType(),
                    contactDTO.getData()
            );
            return Response.success(contactVOS);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除联系方式")
    public Response<List<ContactVO>> deleteContactById(@PathVariable String id) {
        if (id == null || id.isEmpty()) {
            return Response.error("id is empty or null");
        }

        try {
            List<ContactVO> contactVOS = contactService.deleteContact(id);
            return Response.success(contactVOS);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

}
