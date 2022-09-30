export default function Main(props) {
    return(
        <main className='main--section'>
            <div className='main--container'>
                <h1 className='main--header'>Quizzical</h1>
                <h2 className='main--description'>Some description if needed</h2>
                <button className='main--button' onClick={props.startQuiz}>Start Quiz</button>
            </div>
        </main>
    )
}