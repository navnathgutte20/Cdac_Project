package com.farmafriend.erp.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {

   
    public String upload(MultipartFile file) throws IOException;

       
}