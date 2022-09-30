export default function Quiz(props) {
   return(
    <div className="quiz--main">
        <div className='questions-container' id={props.questionId}>
        <h2>{props.question}</h2>
        <div className="options-grid">
        {props.options.map(item => {
            
            const styles = {
                backgroundColor: props.submit ? (item.isSelected && item.isCorrect === false) ? 'red' : (item.isCorrect) ? 'green': '' : (item.isSelected) ? "#59E391" : "white"
            }

            
            return (
            <div key={item.id} className="quiz--option" onClick={(event) => props.toggleIsSelected(event.target.id, event.target.parentElement.parentElement.parentElement.id)}>
             <h2 id={item.id} className="option" style={styles}>{item.answerText}</h2>
            </div>
        )})}
        </div>
        </div>
    </div>
   )
}
