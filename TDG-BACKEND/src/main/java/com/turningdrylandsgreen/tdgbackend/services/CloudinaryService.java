package com.turningdrylandsgreen.tdgbackend.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public List<String> uploadMultipleFiles(List<MultipartFile> files) throws IOException {
        List<String> uploadUrls = new ArrayList<>();

        if (files == null || files.isEmpty())
            return uploadUrls;

        for (MultipartFile file:files){
            if (!file.isEmpty()){
                Map<?,?> uploadResult = cloudinary.uploader().upload( file.getBytes(), ObjectUtils.asMap("resource_type","auto"));
                String url = (String) uploadResult.get("secure_url");
                uploadUrls.add(url);
            }
        }
        return uploadUrls;
    }
}
