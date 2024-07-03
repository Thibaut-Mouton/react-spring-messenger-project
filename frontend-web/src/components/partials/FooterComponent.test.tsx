import React from "react"
import {render, screen} from "@testing-library/react"
import {FooterComponent} from "./FooterComponent"

describe(FooterComponent.name, () => {
    test("should render footer component", () => {
        render(<FooterComponent/>)
        expect(screen.getByTestId("footer-title").textContent).toEqual("FastLiteMessage - Open source software")
    })
})