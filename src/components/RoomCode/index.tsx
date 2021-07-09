import copyImg from '../../assets/images/copy.svg';

import './styles.scss';

type RoomCodeProps = {
  code: string;
}


export const RoomCode = (props: RoomCodeProps) => {

  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText("-MdoEZYwsPoJZtTpzyS1");
  }

  return (
    <button className="room-code" onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={copyImg} alt="Copy room code" />
      </div>
      <span> Sala #{props.code} </span>
    </button >
  );
}
