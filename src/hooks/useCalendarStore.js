import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store";
import calendarApi from "../api/calendarApi";
import { convertEventsToDateEvents } from "../helpers";
import Swal from "sweetalert2";


export const useCalendarStore = () => {

    const { events, activeEvent } = useSelector(state => state.calendar);
    const { user } = useSelector(state => state.auth);

    const dispatch = useDispatch();

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent))
    }

    const startSavingEvent = async (calendarEvent) => {

        try {
            if (calendarEvent.id) {
                //Update
                await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);
                dispatch(onUpdateEvent({ ...calendarEvent, user }));
                return;
            }
            //Create
            const { data } = await calendarApi.post('events', calendarEvent);
            dispatch(onAddNewEvent({ ...calendarEvent, id: data.event.id, user }));

        } catch (error) {
            console.log(error)
            Swal.fire('Saving error', error.response.data.msg, 'error')
        }

    }

    const startDeletingEvent = () => {
        dispatch(onDeleteEvent())
    }

    const startLoadingEvents = async () => {

        try {
            const { data } = await calendarApi.get('/events')
            const events = convertEventsToDateEvents(data.events)
            dispatch(onLoadEvents(events))


        } catch (error) {
            console.log('Error loading events')
        }

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
        startLoadingEvents,
    }

}
