package com.bettercallxiaojin.home.controller;

import com.bettercallxiaojin.home.common.BaseContext;
import com.bettercallxiaojin.home.pojo.DTO.AddOrganizationDTO;
import com.bettercallxiaojin.home.pojo.DTO.OrganizationDTO;
import com.bettercallxiaojin.home.pojo.VO.OrganizationVO;
import com.bettercallxiaojin.home.pojo.entity.Response;
import com.bettercallxiaojin.home.service.OrganizationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/organization")
@RequiredArgsConstructor
@Tag(name = "组织管理", description = "组织相关接口")
public class OrganizationController {

    private final OrganizationService organizationService;

    @PostMapping("/add")
    @Operation(summary = "添加新组织")
    public Response<List<OrganizationVO>> addOrganization(@Valid @RequestBody AddOrganizationDTO addOrganizationDTO) {
        if (addOrganizationDTO.getEndDate() != null) {
            if (addOrganizationDTO.getStartDate().isAfter(addOrganizationDTO.getEndDate())) {
                return Response.error("start date can't be after end date");
            }
        }

        try {
            List<OrganizationVO> organizations = organizationService.addOrganization(
                    addOrganizationDTO.getName(),
                    addOrganizationDTO.getType(),
                    addOrganizationDTO.getStartDate(),
                    addOrganizationDTO.getEndDate(),
                    addOrganizationDTO.getPosition(),
                    addOrganizationDTO.getDescription(),
                    addOrganizationDTO.getLocation()
            );
            return Response.success(organizations);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }


    @GetMapping("/{id}")
    @Operation(summary = "根据id获取组织")
    public Response<OrganizationVO> getOrganizationById(@PathVariable String id) {
        if (id == null || id.isEmpty()) {
            return Response.error("id is empty or null");
        }
        try {
            OrganizationVO organization = organizationService.getOrganizationById(id);
            return Response.success(organization);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @GetMapping("/user")
    @Operation(summary = "根据用户id获取组织")
    public Response<List<OrganizationVO>> getOrganizationByUserId(@RequestParam String userId) {
        if (userId == null || userId.isEmpty()) {
            userId = BaseContext.getUserId();
        }
        try {
            List<OrganizationVO> organizations = organizationService.getOrganizationByUserId(userId);
            return Response.success(organizations);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @PutMapping("/update")
    @Operation(summary = "修改组织信息")
    public Response<List<OrganizationVO>> updateOrganizationById(@Valid @RequestBody OrganizationDTO organizationDTO) {


        try {
            List<OrganizationVO> organizations = organizationService.updateOrganization(
                    organizationDTO.getId(),
                    organizationDTO.getName(),
                    organizationDTO.getType(),
                    organizationDTO.getStartDate(),
                    organizationDTO.getEndDate(),
                    organizationDTO.getPosition(),
                    organizationDTO.getDescription(),
                    organizationDTO.getLocation()
            );
            return Response.success(organizations);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除组织")
    public Response<List<OrganizationVO>> deleteOrganizationById(@PathVariable String id) {
        if (id == null || id.isEmpty()) {
            return Response.error("id is empty or null");
        }

        try {
            List<OrganizationVO> organizations = organizationService.deleteOrganization(id);
            return Response.success(organizations);
        } catch (Exception e) {
            return Response.error(e.getMessage());
        }
    }
}
