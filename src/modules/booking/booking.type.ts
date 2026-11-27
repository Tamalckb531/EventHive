export type BookingStatus = "confirmed" | "cancelled";

export interface Booking {
    id: number;
    event_id: number;
    attendee_id: number;
    tickets_booked: number;
    total_price: string;
    status: BookingStatus;
    created_at: Date;
    updated_at: Date;
}

export interface UserBooking {
    id: number;
    event: {
        id: number;
        title: string;
        date: Date;
        location: string;
    };
    tickets_booked: number;
    total_price: string;
    status: BookingStatus;
    created_at: Date;
}