import { Button, MenuItem, TextField } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Schema } from "../types/zod";
import toast from "react-hot-toast";

const AddNews = () => {
  const form = useForm<Schema>({
    defaultValues: {
      // isHeadline: false,
    },
  });
  const { handleSubmit, register, formState, reset } = form;
  const { errors } = formState;

  const headline = [
    {
      value: true,
      label: "true",
    },
    {
      value: false,
      label: "false",
    },
  ];

  const [picture, setPicture] = useState<File>();

  const onSubmit = async (data: Schema) => {
    const formData = new FormData();
    formData.append("image", picture as Blob);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("url", data.url);
    formData.append("short_desc", data.short_desc);

    try {
      const response = await fetch(`http://localhost:4001/api/news/addNews`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        toast.error("Error");
      } else {
        toast.success("News added sucessfully");
        reset();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>AddNews</h1>
      <div>
        <TextField
          id="standard-basic"
          label="Title"
          variant="standard"
          type="text"
          {...register("title", { required: "title is required" })}
          error={!!errors.title}
          helperText={errors.title?.message}
        />
        <br />
        {/* <TextField
          id="standard-basic"
          label="headline"
          variant="standard"
          select
          {...register("isHeadline", { required: "Headline is required" })}
          error={!!errors.isHeadline}
          helperText={errors.isHeadline?.message}
        >
          {headline.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField> */}
        <br />
        <TextField
          id="standard-basic"
          label="Short Description"
          variant="standard"
          type="text"
          {...register("short_desc", {
            required: "short description is required",
          })}
          error={!!errors.short_desc}
          helperText={errors.short_desc?.message}
        />
        <br />
        <TextField
          id="standard-basic"
          label="Description"
          multiline
          variant="standard"
          type="text"
          {...register("description", { required: "Description is required" })}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        <br />
        <TextField
          id="standard-basic"
          label="url"
          variant="standard"
          type="text"
          {...register("url", { required: "Url is required" })}
          error={!!errors.url}
          helperText={errors.url?.message}
        />
        <br />
        <TextField
          id="standard-basic"
          label="image"
          variant="standard"
          type="file"
          {...register("image", { required: "Image is required" })}
          error={!!errors.image}
          helperText={errors.description?.message}
          onChange={(e) => {
            const inputElement = e.target as HTMLInputElement;
            setPicture(inputElement.files?.[0]);
          }}
        />
        <br />
      </div>
      <br />
      <Button
        color="success"
        variant="outlined"
        onClick={handleSubmit(onSubmit)}
      >
        Submit
      </Button>
    </div>
  );
};

export default AddNews;
