import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store";
import calendarApi from "../api/calendarApi";
import { convertEventsToDateEvents } from "../helpers";


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

    const startLoadingEvents = async () => {

        try {
            const { data } = await calendarApi.get('/events')
            const events = convertEventsToDateEvents(data.events)
            dispatch(onLoadEvents(events))
            console.log(events)

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
