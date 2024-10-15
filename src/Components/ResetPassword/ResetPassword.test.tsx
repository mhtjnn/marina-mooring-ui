import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResetPassword from './ResetPassword';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../../Store/Store';

describe('ResetPassword Component', () => {

  it("", () => {

    render(

      <Provider store={store}>

        <BrowserRouter>
          <ResetPassword />
        </BrowserRouter>

      </Provider>




    )

  })

});
