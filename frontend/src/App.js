import React from "react"
import './App.css';
import CoursePage from "./pages/CoursePage";
import { ChakraProvider } from "@chakra-ui/react"

function App() {
    return (
        <ChakraProvider>
            <CoursePage></CoursePage>
        </ChakraProvider>
    );
}

export default App;
