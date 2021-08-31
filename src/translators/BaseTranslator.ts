/**
 * Un translator tranforme toujours une entité T en entité U.
 */
export default interface BaseTranslator<T, U>{
    translate(data: T): U
    translateMulti(data: T[]):U[]
}