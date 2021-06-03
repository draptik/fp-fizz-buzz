import { chain, Either, getSemigroup, getValidation, left, mapLeft, right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import { sequenceT } from 'fp-ts/lib/Apply'
import { map } from 'fp-ts/lib/Either'
import { isLeft, isRight } from "fp-ts/lib/These";

function lift<E, A>(check: (a: A) => Either<E, A>): (a: A) => Either<NonEmptyArray<E>, A> {
    return a =>
      pipe(
        check(a),
        mapLeft(a => [a])
      )
}

const isFizz = (a: number): Either<string, number> =>
    a % 3 === 0 ? left('fizz') : right(a)

const isBuzz = (a: number): Either<string, number> =>
    a % 5 === 0 ? left('buzz') : right(a)

const liftedFizz = lift(isFizz)
const liftedBuzz = lift(isBuzz)


// function validatePassword(s: string): Either<NonEmptyArray<string>, string> {
//   return pipe(
//     sequenceT(getValidation(getSemigroup<string>()))(
//       liftedBuzz(s),
//       liftedFizz(s)
//     ),
//     map(() => s)
//   )
// }

const apply = (a:Either<NonEmptyArray<string>, string>) => (f:Either<NonEmptyArray<string>, (x:string) => string>) => {
  if (isRight(f) && isRight(a)) { 
    const f2 = f.right;
    const a2 = a.right;
    const bla = f2(a2);
    return right(bla);
  } else if (isLeft(f) && isRight(a)) {
    return f;
  } else if (isRight(f) && isLeft(a)) {
    return a;
  } else if (isLeft(f) && isLeft(a)) {
    const f2 = f.left;
    const a2 = a.left;
    const result = f2.concat(a2);
    return left(result);
  }
}


// F#
//
//  Ok (createCreditCard)
// |> apply (card.Number |> validateNumber |> liftError)
//    let result1 = apply (card.Number |> validateNumber |> liftError)(Ok (createCreditCard))
//let result2 = apply (card.Expiry |> validateExpiry |> liftError)(result1)
// let result3 = apply (card.Cvv |> validateCvv |> liftError)(result2)

// let result1 = apply (liftError(validateNumber(card.Number)(Ok (createCreditCard))

function validateCreditCard (card: string): Either<NonEmptyArray<string>, string> {
  const error1 = () => left("error 1");
  const liftResult = lift(error1);
  const input = () => right(card);
  let r1 = apply(liftResult)(input)
  return right("todo");
}

// export const fizzbuzz = (a: number): Either<NonEmptyArray<string>, number> =>
//       pipe(
//         liftedFizz(a), 
//         chain(liftedBuzz))