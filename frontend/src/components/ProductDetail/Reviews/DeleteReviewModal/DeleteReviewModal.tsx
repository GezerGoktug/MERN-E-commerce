import { IoMdTrash } from "react-icons/io";
import Button from "../../../ui/Button/Button";
import styles from "./DeleteReview.module.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../../utils/api";
import toast from "react-hot-toast";
import { DeleteReviewModalDTO } from "../Reviews/Reviews";
import { useParams } from "react-router-dom";

interface DeleteReviewModalProps {
  data: DeleteReviewModalDTO;
  closeModal: () => void;
}

const DeleteReviewModal = ({ data, closeModal }: DeleteReviewModalProps) => {
  const queryClient = useQueryClient();
  const params = useParams();
  const mutation = useMutation({
    mutationKey: ["delete_comment"],
    mutationFn: () => {
      return api.delete(`/product/${params.id}/comment/${data._id}`);
    },
    onSuccess: async (data) => {
      toast.success(data.data.message);
      await queryClient.invalidateQueries({ queryKey: ["product_detail"] });
      closeModal();
    },
    onError(error) {
      const apiError = error?.response?.data?.error.errorMessage;
      if (typeof apiError === "string") toast.error(apiError);
    },
  });

  const handleDeleteComment = () => {
    mutation.mutate();
  };

  return (
    <div className={styles.delete_review_modal_wrapper}>
      <h6>Are you sure you want to delete your comment?</h6>
      <p>
        This comment will be permanently deleted. Are you sure you still want to
        delete it?
      </p>
      <div className={styles.delete_review_modal_btn_group}>
        <Button onClick={() => closeModal()} size="sm" variant="secondary">
          CANCEL
        </Button>
        <Button
          loading={mutation.isPending}
          onClick={() => handleDeleteComment()}
          leftIcon={IoMdTrash}
          size="sm"
          leftIconSize={20}
          variant="danger"
        >
          DELETE
        </Button>
      </div>
    </div>
  );
};

export default DeleteReviewModal;
