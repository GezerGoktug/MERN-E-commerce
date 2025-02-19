import { IoMdTrash } from "react-icons/io";
import Button from "../../../ui/Button/Button";
import styles from "./DeleteProductModal.module.scss";
import { DeleteProductDTO } from "../Products";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../../utils/api";
import toast from "react-hot-toast";

interface DeleteProductModalProps {
  data: DeleteProductDTO;
  closeModal: () => void;
}

const DeleteProductModal = ({ closeModal, data }: DeleteProductModalProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["admin_delete_product"],
    mutationFn: () => {
      return api.delete(`/product/${data._id}`);
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success(data.data.message);
      closeModal();
    },
    onError: (err) => {
      const errorMessage = err.response?.data.error.errorMessage;
      if (typeof errorMessage === "string") toast.error(errorMessage);
    },
  });

  const handleDeleteProduct = () => {
    mutation.mutate();
  };

  return (
    <div className={styles.delete_product_modal_wrapper}>
      <h6>Are you sure?</h6>
      <p>Are you sure you want to delete this product?</p>
      <div className={styles.delete_product_modal_btn_group}>
        <Button onClick={() => closeModal()} size="sm" variant="secondary">
          CANCEL
        </Button>
        <Button
          loading={mutation.isPending}
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
