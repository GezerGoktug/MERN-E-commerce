import { IoCloudUploadOutline } from "react-icons/io5";
import styles from "./EditProductModal.module.scss";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useState } from "react";
import clsx from "clsx";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../../utils/api";
import Input from "../../../ui/Input/Input";
import Button from "../../../ui/Button/Button";
import { SizeType } from "../../../../types/types";
import { EditProductDTO } from "../Products";
import { productSchema } from "../../../../schemas/schema";

interface EditProductModalProps {
  data: EditProductDTO;
  closeModal: () => void;
}

type ImagesType = {
  mainImage: string | null;
  subImage1: string | null;
  subImage2: string | null;
  subImage3: string | null;
};

const EditProductModal = ({ data, closeModal }: EditProductModalProps) => {
  const queryClient = useQueryClient();
  const [images, setImages] = useState<ImagesType>({
    mainImage: data.image,
    subImage1: data.subImages[1],
    subImage2: data.subImages[2],
    subImage3: data.subImages[3],
  });

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      mainImage: null,
      subImage1: null,
      subImage2: null,
      subImage3: null,
      name: data.name,
      description: data.description,
      price: data.price.toString(),
      sizes: data.sizes,
      category:data.category,
      subCategory:data.subCategory
    },
  });

  const onChangeImage = (
    e: ChangeEvent<HTMLInputElement>,
    field: "mainImage" | "subImage1" | "subImage2" | "subImage3"
  ) => {
    const file = e.target.files ? e.target.files[0] : undefined;

    if (file) {
      const url = URL.createObjectURL(file);
      setImages((prev) => ({ ...prev, [field]: url }));
      form.setValue(field, file);
    }
  };

  const onChangeSizes = (value: SizeType) => {
    const isInSizesArray = form
      .getValues("sizes")
      .some((size) => size === value);
    if (isInSizesArray) {
      form.setValue(
        "sizes",
        form.getValues("sizes").filter((size) => size !== value)
      );
    } else {
      form.setValue("sizes", [...form.getValues("sizes"), value]);
    }
  };

  const mutation = useMutation({
    mutationKey: [""],
    mutationFn: (updatedData: FormData) => {
      return api.put(`/product/${data._id}`, updatedData);
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success(data.data.message);
      form.reset();
      closeModal();
    },
    onError: (err) => {
      const errorMessage = err.response?.data.error.errorMessage;
      if (typeof errorMessage === "string") {
        toast.error(errorMessage);
      }
    },
  });

  const onSubmit = (data: z.infer<typeof productSchema>) => {
    const formData = new FormData();

    if (!data.mainImage) {
      toast.error("The product must have one main image.");
      return;
    }

    formData.append("mainImage", data.mainImage);
    formData.append("subImage1", data.subImage1);
    formData.append("subImage2", data.subImage2);
    formData.append("subImage3", data.subImage3);

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("subCategory", data.subCategory);
    formData.append("price", data.price);
    formData.append("sizes", JSON.stringify(data.sizes));

    mutation.mutate(formData);
  };
  return (
    <div className={styles.edit_product_modal_wrapper}>
      <h6>Edit Product</h6>
      <form
        className={styles.edit_product_modal_form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className={styles.edit_product_modal_files_upload}>
          <div className={styles.edit_product_modal_main_image}>
            {images?.mainImage && <img src={images.mainImage} alt="" />}
            <input
              accept="image/*"
              className={styles.edit_product_modal_file_input}
              onChange={(e) => onChangeImage(e, "mainImage")}
              type="file"
            />
            <IoCloudUploadOutline size={40} />
          </div>
          <div className={styles.edit_product_modal_sub_images}>
            <div className={styles.edit_product_modal_sub_image}>
              {images?.subImage1 && <img src={images.subImage1} alt="" />}
              <input
                accept="image/*"
                className={styles.edit_product_modal_file_input}
                onChange={(e) => onChangeImage(e, "subImage1")}
                type="file"
              />
              <IoCloudUploadOutline size={40} />
            </div>
            <div className={styles.edit_product_modal_sub_image}>
              {images?.subImage2 && <img src={images.subImage2} alt="" />}
              <input
                accept="image/*"
                className={styles.edit_product_modal_file_input}
                onChange={(e) => onChangeImage(e, "subImage2")}
                type="file"
              />
              <IoCloudUploadOutline size={40} />
            </div>
            <div className={styles.edit_product_modal_sub_image}>
              {images?.subImage3 && <img src={images.subImage3} alt="" />}
              <input
                accept="image/*"
                className={styles.edit_product_modal_file_input}
                onChange={(e) => onChangeImage(e, "subImage3")}
                type="file"
              />
              <IoCloudUploadOutline size={40} />
            </div>
          </div>
        </div>
        <Controller
          name="name"
          control={form.control}
          render={({ field }) => (
            <>
              <label>Product Name:</label>
              <Input
                className={styles.edit_product_modal_input}
                fields={field}
                placeholder="Name"
                minLength={5}
              />
            </>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field }) => (
            <>
              <label>Description:</label>
              <textarea placeholder="Description" minLength={10} {...field} />
            </>
          )}
        />

        <div className={styles.edit_product_modal_selects}>
          <Controller
            name="category"
            control={form.control}
            render={({ field }) => (
              <div className={styles.edit_product_modal_select_section}>
                <label>Category:</label>
                <select {...field}>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>
            )}
          />
          <Controller
            name="subCategory"
            control={form.control}
            render={({ field }) => (
              <div className={styles.edit_product_modal_select_section}>
                <label>Sub Category:</label>
                <select {...field}>
                  <option value="Topwear">Topwear</option>
                  <option value="Bottomwear">Bottomwear</option>
                  <option value="Winterwear">Winterwear</option>
                </select>
              </div>
            )}
          />
          <Controller
            name="price"
            control={form.control}
            render={({ field }) => (
              <div className={styles.edit_product_modal_select_section}>
                <label>Price:</label>
                <Input
                  className={styles.edit_product_modal_input}
                  fields={field}
                  type="number"
                  placeholder="Price"
                  min="1"
                />
              </div>
            )}
          />
        </div>
        <label>Select sizes:</label>
        <div className={styles.edit_product_modal_sizes}>
          <div
            onClick={() => onChangeSizes("SMALL")}
            className={clsx(styles.edit_product_modal_size, {
              [styles.active]: form.watch("sizes").includes("SMALL"),
            })}
          >
            S
          </div>
          <div
            onClick={() => onChangeSizes("MEDIUM")}
            className={clsx(styles.edit_product_modal_size, {
              [styles.active]: form.watch("sizes").includes("MEDIUM"),
            })}
          >
            M
          </div>
          <div
            onClick={() => onChangeSizes("LARGE")}
            className={clsx(styles.edit_product_modal_size, {
              [styles.active]: form.watch("sizes").includes("LARGE"),
            })}
          >
            L
          </div>
          <div
            onClick={() => onChangeSizes("XLARGE")}
            className={clsx(styles.edit_product_modal_size, {
              [styles.active]: form.watch("sizes").includes("XLARGE"),
            })}
          >
            X
          </div>
          <div
            onClick={() => onChangeSizes("XXLARGE")}
            className={clsx(styles.edit_product_modal_size, {
              [styles.active]: form.watch("sizes").includes("XXLARGE"),
            })}
          >
            XXL
          </div>
        </div>
        <div className={styles.edit_product_modal_errors}>
          {Object.values(form.formState.errors).map((val, i) => (
            <div className={styles.edit_product_modal_error} key={"error_" + i}>
              <span>&#9679;</span>
              <div>{val.message as string}</div>
            </div>
          ))}
        </div>
        <Button loading={mutation.isPending} type="submit">
          EDIT
        </Button>
      </form>
    </div>
  );
};

export default EditProductModal;
