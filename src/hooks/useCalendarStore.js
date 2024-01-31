import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent } from "../store";
import calendarApi from "../api/calendarApi";


export const useCalendarStore = () => {

    const { events, activeEvent } = useSelector(state => state.calendar);
    const { user } = useSelector(state => state.auth);

    const dispatch = useDispatch();

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent))
    }

    const startSavingEvent = async (calendarEvent) => {



        if (calendarEvent._id) {
            //Update
            dispatch(onUpdateEvent({ ...calendarEvent }));
        } else {
            //Create
            const { data } = await calendarApi.post('events', calendarEvent);

            dispatch(onAddNewEvent({ ...calendarEvent, id: data.event.id, user }));
        }
    }

    const startDeletingEvent = () => {
        dispatch(onDeleteEvent())
    }


    return {
        // Properties
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,

        //Methods
        startDeletingEvent,
        setActiveEvent,
        startSavingEvent,
    }

}
