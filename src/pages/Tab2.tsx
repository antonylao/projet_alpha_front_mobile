import { IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';
import UpcomingEventList from '../components/UpcomingEventList/UpcomingEventList';
import { getUpcomingEvents } from '../services/api/events';
import { useQuery } from "@tanstack/react-query"
import { DateTimeUtils } from '../services/utils/DateTimeUtils';
import { useRef, useState } from 'react';
import { OverlayEventDetail } from '@ionic/core/components';

const Tab2: React.FC = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);
  const [message, setMessage] = useState(
    'This modal example uses triggers to automatically open a modal when the button is clicked.'
  );

  //* functions for modal: not sure what they do
  function confirm() {
    modal.current?.dismiss(input.current?.value, 'confirm');
  }

  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    if (ev.detail.role === 'confirm') {
      // action when confirming on the modal
      setMessage(`Hello, ${ev.detail.data}!`);
    }
  }
  //* end functions for modal

  const { data, isSuccess, isLoading, isError } = useQuery({
    queryKey: [`allUpcomingEvents`],
    queryFn: () => getUpcomingEvents(),
  })

  if (isLoading) return <div>Chargement...</div>;
  if (isError) return <div>Erreur lors de la récupération de la liste complète des événements</div>;
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>VOLUNTEER: EVENTS</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">VOLUNTEER: EVENTS</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* <UpcomingEventList></UpcomingEventList> */}

        {/* content */}
        <IonCard>
          <IonCardContent>
            <IonList>
              {data.map((event: any) => (
                <IonItem>
                  <IonThumbnail slot="start">
                    <img alt={`picture event id ${event.id}`} src={event.picture} />
                  </IonThumbnail>
                  <IonLabel>{event.title} {DateTimeUtils.formatDateTimeForTable(event.startOn)} </IonLabel>
                  {/* Button opening a modal */}
                  <IonButton id="open-modal" expand="block">
                    Open
                  </IonButton>
                  <p>{message}</p>
                  <IonModal ref={modal} trigger="open-modal" onWillDismiss={(ev) => onWillDismiss(ev)}>
                    <IonHeader>
                      <IonToolbar>
                        <IonButtons slot="start">
                          <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
                        </IonButtons>
                        <IonTitle>Welcome</IonTitle>
                        <IonButtons slot="end">
                          <IonButton strong={true} onClick={() => confirm()}>
                            Confirm
                          </IonButton>
                        </IonButtons>
                      </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                      <IonItem>
                        <IonInput
                          label="Enter your name"
                          labelPlacement="stacked"
                          ref={input}
                          type="text"
                          placeholder="Your name"
                        />
                      </IonItem>
                    </IonContent>
                  </IonModal>
                </IonItem>

              ))}
            </IonList>
          </IonCardContent>
        </IonCard>


      </IonContent>
    </IonPage>
  );
};

export default Tab2;
