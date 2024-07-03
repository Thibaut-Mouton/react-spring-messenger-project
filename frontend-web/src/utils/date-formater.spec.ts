import {dateParser} from "./date-formater"

describe("dateFormater", () => {
    describe(dateParser.name, () => {
        it("should format date correctly", () => {
            const result = dateParser("24/04/2024")
            expect(result).toBeDefined()
        })
    })
})
