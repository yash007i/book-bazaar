export const OrderStatusEnum = {
    PLACED: 'placed',
    ACCEPTED: 'accepted',
    OUT_FOR_DELIVERY: 'out_for_delivery',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
};

export const AvailableOrderStatus = Object.values(OrderStatusEnum);