import { IonButton, IonContent, IonHeader, IonInput, IonInputPasswordToggle, IonItem, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import { useState } from 'react';
import { YupUtils } from '../services/utils/YupUtils';
import { SignInFormInterface } from '../services/utils/CustomTypes';
import { signIn } from '../services/api/auth';
import { Redirect } from 'react-router';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import { useHistory } from 'react-router';

const Tab1: React.FC = () => {
  const history = useHistory();

  const [errorSignIn, setErrorSignIn] = useState<boolean>(false)
  console.log("🚀 ~ errorSignIn:", errorSignIn)

  const schema = yup.object().shape({
    email: YupUtils.constraints.email.required("Email requis"),
    password: YupUtils.constraints.password.required("Mot de passe requis")
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })


  const onSubmit = async (form: any) => {
    try {
      console.log("🚀 ~ onSubmit ~ form:", form)

      const data = await signIn("volunteer", form)
      //store accessToken & refreshToken in localStorage
      localStorage.setItem('accessToken', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);

      // redirect to event page if connection successful
      history.push('/tab2')
    } catch (error: any) {
      console.error(error.response.data)
      //stay on sign up and display error message
      setErrorSignIn(true)
    }
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>VOLUNTEER Sign In</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">VOLUNTEER Sign In</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="flex justify-center h-full bg-cover bg-center bg-[url('https://www.premier-ltd.com/wp-content/uploads/2018/04/Manchester-Central-Events.jpg')]" >
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white flex justify-center opacity-95 p-10 rounded-md mt-8 mb-8 w-80 max-w-screen-lg sm:w-96">
            {/* <IonButton>Default</IonButton> */}
            {/* <button type="submit" >Sign In</button> */}
            <div className="mb-1 flex justify-center flex-col gap-6">
              <IonText className='flex justify-center' color="danger" ><p>{errorSignIn ? 'Les identifiants ne sont pas valides' : ''}</p></IonText>
              <IonText color="dark" className="-mb-3">
                <h6 className='flex justify-center'>Your Email</h6>
              </IonText>
              <IonItem>
                <IonInput placeholder="name@mail.com" {...register("email")}></IonInput>
              </IonItem>
              <IonText className='flex justify-center' color="danger" ><p>{errors.email?.message}</p></IonText>
              <IonText className="flex justify-center" color="dark" >
                <h6>Password</h6>
              </IonText>
              <IonInput type="password" value="********" {...register("password")}>
                <IonInputPasswordToggle slot="end" ></IonInputPasswordToggle>
              </IonInput>
              <IonText className="flex justify-center" color="danger" ><p>{errors.password?.message}</p></IonText>
              <IonButton type='submit' >Sign In</IonButton>
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
