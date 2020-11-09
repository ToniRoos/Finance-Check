import * as React from 'react';
import Main from './components/Main';
import * as ReactDom from 'react-dom';
import 'bootstrap';
import { DataAccountProvider } from './stores/accountDataStore';
import { FilterProvider } from './stores/filterStore';
require('./styles/_custom.scss');

ReactDom.render(<DataAccountProvider>
    <FilterProvider>
        <Main />
    </FilterProvider>
</DataAccountProvider>, document.getElementById('root'));

