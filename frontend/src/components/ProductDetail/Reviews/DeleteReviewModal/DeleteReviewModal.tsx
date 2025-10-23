import { IoMdTrash } from "react-icons/io";
import Button from "../../../ui/Button/Button";
import styles from "./DeleteReview.module.scss";
import toast from "react-hot-toast";
import { DeleteReviewModalDTO } from "../Reviews/Reviews";
import { useParams } from "react-router-dom";
import { useDeleteCommentMutation } from "../../../../services/hooks/mutations/product.mutations";

interface DeleteReviewModalProps {
  data: DeleteReviewModalDTO;
  closeModal: () => void;
}

const DeleteReviewModal = ({ data, closeModal }: DeleteReviewModalProps) => {
  const params = useParams();

  const { mutate, isPending } = useDeleteCommentMutation({
    onSuccess: (data) => {
      toast.success(data.data.message);
      closeModal();
    },
    onError(error) {
      const apiError = error?.response?.data?.error.errorMessage;
      if (typeof apiError === "string") toast.error(apiError);
    },
  })

  const handleDeleteComment = () => {
    if (params.id)
      mutate({ productId: params.id, commentId: data._id });
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
          loading={isPending}
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
