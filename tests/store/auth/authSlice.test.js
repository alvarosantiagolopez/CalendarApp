import { authSlice, clearErrorMessage, onLogin, onLogout } from "../../../src/store/auth/authSlice";
import { authenticatedState, initialState } from "../../fixtures/authStates";
import { testUserCredentials } from "../../fixtures/testUser";

describe('Pruebas en authSlice', () => {

    test('debe de retornar el estado inicial', () => {
        expect(authSlice.getInitialState()).toEqual(initialState)
    });

    test('debe de realizar un login', () => {

        const state = authSlice.reducer(initialState, onLogin(testUserCredentials));
        expect(state).toEqual({
            status: 'authenticated',
            user: testUserCredentials,
            errorMessage: undefined
        })

    });

    test('debe de realizar el logout', () => {

        const state = authSlice.reducer(authenticatedState, onLogout());
        expect(state).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: undefined
        })

    });

    test('debe de realizar el logout con un error', () => {

        const errorMessage = 'Not valid credentials'
        const state = authSlice.reducer(authenticatedState, onLogout(errorMessage));
        expect(state).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage
        })

    });

    test('debe de limpiar el mensaje de error', () => {

        const errorMessage = 'Not valid credentials'
        const state = authSlice.reducer(authenticatedState, onLogout(errorMessage));
        const newState = authSlice.reducer(state, clearErrorMessage());

        expect(newState.errorMessage).toBe(undefined);

    });

});