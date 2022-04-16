// Custom
// Services
import { getProductById } from "../../services/products";


export const validateCartItems = async (items, removeItem) => {
    for (const item of items) {
        if (!(await getProductById(item.id))) {
            removeItem(item.id);
        }
    }
};