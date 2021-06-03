import { Either, isLeft, left, right, mapLeft } from "fp-ts/lib/Either";
import { fizzbuzz } from "./fizzbuzz"

describe("fizzbuzz", () => {
    it("1 returns right(1)", () => {
        expect(fizzbuzz(1)).toEqual(right(1));
    })
    it("3 returns left(fizz)", () => {
        expect(fizzbuzz(3)).toEqual(left(["fizz"]));
    })
    it("5 returns left(buzz)", () => {
        expect(fizzbuzz(5)).toEqual(left(["buzz"]));
    })
    it("15 returns left(fizz, buzz)", () => {
        expect(fizzbuzz(15)).toEqual(left(["fizz", "buzz"]));
    })

    it("mapLeft demo", () => {
        var myMapLeft = function (f:any) { 
            return function (fa:any) {
                return isLeft(fa) 
                    ? left(f(fa.left)) 
                    : fa;
            }; 
        };

        const l:Either<string, number> = left("x");
        
        const f = (x:string) => [x];

        console.log('xxx');
        const result = myMapLeft(f)(l);
        console.log(result);

        expect(result).toEqual(left(['x']));
    })

    
})