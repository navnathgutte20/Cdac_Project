package com.farmafriend.erp.controller;

import java.io.IOException;

import com.farmafriend.erp.service.CloudinaryService;
import com.farmafriend.erp.service.impl.CloudinaryServiceImpl;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/image")
@RequiredArgsConstructor
public class CloudinaryController {

    private final CloudinaryService cloudinaryService;

	@PostMapping("/upload")
	public String uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
		System.out.println("post: Image upload");
	    return cloudinaryService.upload(file);
	}
}
