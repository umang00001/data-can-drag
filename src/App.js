import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./Home"
const App = () => {
    const design = (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </>
    )
    return design;
}
export default App