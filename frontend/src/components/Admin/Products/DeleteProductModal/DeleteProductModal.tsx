import { IoMdTrash } from "react-icons/io";
import Button from "../../../ui/Button/Button";
import styles from "./DeleteProductModal.module.scss";
import { DeleteProductDTO } from "../Products";
import toast from "react-hot-toast";
import { useDeleteProductMutation } from "../../../../services/hooks/mutations/product.mutations";

interface DeleteProductModalProps {
  data: DeleteProductDTO;
  closeModal: () => void;
}

const DeleteProductModal = ({ closeModal, data }: DeleteProductModalProps) => {
  const { mutate, isPending } = useDeleteProductMutation({
    onSuccess: (data) => {
      toast.success(data.data.message);
      closeModal();
    },
    onError: (err) => {
      const errorMessage = err.response?.data.error.errorMessage;
      if (typeof errorMessage === "string") toast.error(errorMessage);
    },
  });

  const handleDeleteProduct = () => mutate(data._id);

  return (
    <div className={styles.delete_product_modal_wrapper}>
      <h6>Are you sure?</h6>
      <p>Are you sure you want to delete this product?</p>
      <div className={styles.delete_product_modal_btn_group}>
        <Button onClick={() => closeModal()} size="sm" variant="secondary">
          CANCEL
        </Button>
        <Button
          loading={isPending}
          onClick={() => handleDeleteProduct()}
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

export default DeleteProductModal;
