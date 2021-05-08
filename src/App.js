import React from 'react';
import {
   BrowserRouter,
   Switch,
   Route,
 } from "react-router-dom";

import Home from "./components/home";
import List from "./components/list";

function App (){
      return(
         <div>
         <BrowserRouter>
            <Switch>
                <Route exact  path="/" component={Home} />
                <Route  path="/home" component={Home} />
                <Route exact path="/list" component={List} />
            </Switch>
         </BrowserRouter>
         </div>
      );
}
export default App;