import { useState } from "react";
import Rating from "../CreateReview/Rating/Rating";
import Button from "../../../ui/Button/Button";
import styles from "./EditReviewModal.module.scss";
import { FaPencil } from "react-icons/fa6";
import { EditReviewModalDTO } from "../Reviews/Reviews";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../../utils/api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

interface EditReviewModalProps {
  data: EditReviewModalDTO;
  closeModal: () => void;
}

interface CommentType {
  rating: number;
  content: string;
  productId: string;
}

const EditReviewModal = ({ data, closeModal }: EditReviewModalProps) => {
  const queryClient = useQueryClient();
  const params = useParams();

  const [rating, setRating] = useState<number>(data.rating || 0);
  const [content, setContent] = useState<string>(data.content || "");

  const mutation = useMutation({
    mutationKey: ["update_comment"],
    mutationFn: (body: CommentType) => {
      return api.put(`/product/comment/${data._id}`, body);
    },
    onSuccess: async (data) => {
      toast.success(data.data.message);
      await queryClient.invalidateQueries({ queryKey: ["product_detail"] });
      closeModal();
    },
    onError: (error) => {
      const apiError = error?.response?.data?.error.errorMessage;
      if (typeof apiError === "string") toast.error(apiError);
    },
  });

  const updateComment = () => {
    if (params.id) {
      const body = {
        rating,
        content,
        productId: params.id,
      };
      mutation.mutate(body);
    }
  };

  return (
    <div className={styles.edit_review_modal_wrapper}>
      <h6>Edit Comment</h6>
      <Rating
        defaultRating={rating}
        rateAction={(rate: number) => setRating(rate)}
      />
      <textarea
        autoFocus
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={250}
        placeholder="Enter something "
        name=""
        id=""
      ></textarea>
      <div className={styles.edit_review_modal_btn_group}>
        <Button onClick={() => closeModal()} size="sm" variant="secondary">
          CANCEL
        </Button>
        <Button
          size="sm"
          rightIcon={FaPencil}
          rightIconSize={15}
          loading={mutation.isPending}
          onClick={() => updateComment()}
        >
          UPDATE
        </Button>
      </div>
    </div>
  );
};

export default EditReviewModal;
