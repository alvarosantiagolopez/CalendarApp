import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { authSlice } from "../../src/store";
import { Provider } from "react-redux";
import { initialState, notAuthenticatedState } from "../fixtures/authStates";
import { testUserCredentials } from "../fixtures/testUser";
import calendarApi from "../../src/api/calendarApi";

const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer
        },
        preloadedState: {
            auth: { ...initialState }
        }
    })
}

describe('Pruebas en useAuthStore', () => {

    beforeEach(() => localStorage.clear());

    test('debe de regresar los valores por defecto', () => {

        const mockStore = getMockStore({ ...initialState })

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        expect(result.current).toEqual({
            status: 'checking',
            user: {},
            errorMessage: undefined,
            startLogin: expect.any(Function),
            startRegister: expect.any(Function),
            checkAuthToken: expect.any(Function),
            startLogout: expect.any(Function),
        })

    });

    test('start login debe de realizar el login correctamente', async () => {

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.startLogin(testUserCredentials)
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: "Test User", uid: "65bc7a0931a4d4ff7d11fa1d" },

        });

        expect(localStorage.getItem('token')).toEqual(expect.any(String));
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String));

    });

    test('startLogin debe de fallar la autenticacion', async () => {

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.startLogin({ email: 'something@google.com', password: 'abc' })
        });

        const { errorMessage, status, user } = result.current;
        expect(localStorage.getItem('token')).toBe(null);
        expect(localStorage.getItem('token-init-date')).toBe(null);
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Incorrect credentials',
            status: 'not-authenticated',
            user: {}
        });

        await waitFor(
            () => expect(result.current.errorMessage).toBe(undefined)
        );

    });


    test('startRegister debe de crear un usuario', async () => {

        const newUser = { name: 'Test User 2', email: 'something@google.com', password: 'abc' };

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
            data: {
                ok: true,
                uid: "algun-uid",
                name: 'Test User 2',
                token: 'algun-token'
            }
        });

        await act(async () => {
            await result.current.startRegister(newUser)
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User 2', uid: 'algun-uid' }
        });

        spy.mockRestore();

    });

    test('starRegister debe de fallar la creacion', async () => {

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.startRegister(testUserCredentials)
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Email already in used',
            status: 'not-authenticated',
            user: {}
        });

    });

    test('checkAuthToken debe de fallar si no hay token', async () => {

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.checkAuthToken()
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual(notAuthenticatedState)

    });

    test('checkAuthToken debe de autenticar un usuario si hay token', async () => {

        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.checkAuthToken()
        });

        const { errorMessage, status, user } = result.current;

        console.log({ errorMessage, status, user })

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: '65bc7a0931a4d4ff7d11fa1d' }
        });


    });




});