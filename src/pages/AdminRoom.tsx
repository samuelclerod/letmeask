import { useHistory, useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';
import deleteImg from '../assets/images/delete.svg';

import '../styles/room.scss';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

type RoomParams = {
  id: string;
}

type QuestionHandlerType = {
  id: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}

export const AdminRoom = () => {
  const history = useHistory()
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { questions, title } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push("/");
  }

  async function handleCheckQuestionAnswered(question: QuestionHandlerType): Promise<void> {
    await database.ref(`rooms/${roomId}/questions/${question.id}`).update({
      isAnswered: !question.isAnswered,
    })
  }

  async function handleHighlightQuestion(question: QuestionHandlerType): Promise<void> {
    await database.ref(`rooms/${roomId}/questions/${question.id}`).update({
      isHighlighted: !question.isHighlighted,
    })
  }

  async function handelDeleteQuestion(questionId: string): Promise<void> {
    if (window.confirm('Você tem certeza que deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="" />
          <div>
            <RoomCode code={roomId} />
            <Button
              onClick={handleEndRoom}
              isOutlined
            >Encerar Sala</Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>{title}</h1>
          {questions.length > 0 && <span>{questions.length} perguntas</span>}
        </div>

        <div className="question-list"></div>
        {questions.map(question => (
          <Question
            key={question.id}
            content={question.content}
            author={question.author}
            isAnswered={question.isAnswered}
            isHighlighted={question.isHighlighted}
          >
            <button
              type="button"
              onClick={() => handleCheckQuestionAnswered(question)}
              className={question.isAnswered ? 'marked' : ''}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12.0003" cy="11.9998" r="9.00375" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                <path d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {!question.isAnswered && (
              <button
                type="button"
                onClick={() => handleHighlightQuestion(question)}
                className={question.isHighlighted ? 'marked' : ''}
              ><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            )}

            <button type="button" onClick={() => handelDeleteQuestion(question.id)}>
              <img src={deleteImg} alt="remover pergunta" />
            </button>

          </Question>
        ))}
      </main>
    </div>
  );
}

