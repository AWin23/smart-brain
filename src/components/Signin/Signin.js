import React from 'react';


class Signin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      signInEmail: '',
      signInPassword: ''
    }
  }
  onEmailChange = (event) => {
    this.setState({signInEmail: event.target.value})
  }

  onPasswordChange = (event) => {
    this.setState({signInPassword: event.target.value})
  }

  onSubmitSignIn = () => {
  fetch('https://pure-waters-47974.herokuapp.com/signin', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      email: this.state.signInEmail,
      password: this.state.signInPassword
    })
  })
  .then(response => response.json())
  .then(user => {
    if(user.id){ // does the user exist? Did we receive a user with a property of id?
      this.props.loadUser(user);
        this.props.onRouteChange('home');
    }
  })
  }

  render(){
    const {onRouteChange } = this.props;
    const {signInEmail, signInPassword} = this.state;
    return (
      <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4 black-80">
      <p> <strong>Smart-Brain</strong> is an online facial recognition application that detects faces on image addresses.</p>
      <p>
      <strong>Sign in</strong> to use Smart-Brain. Otherwise make an account.
    </p>
   
      <div className="measure">
        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
          <legend className="f1 fw6 ph0 mh0">Smart Brain</legend>
          <div className="mt3">
            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
            <input 
            className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
            type="email" 
            name="email-address"  
            id="email-address" 
            onChange={this.onEmailChange}
            />
          </div>
          <div className="mv3">
            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
            <input 
            className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
            type="password" 
            name="password"  
            id="password" 
             onChange={this.onPasswordChange}
             />
          </div>
        </fieldset>
        <div className="">
          <input 
          onClick={this.onSubmitSignIn}
          className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
          type="submit" 
          value="Sign in" />
        </div>

        <div className="lh-copy mt3">
          <p  onClick={() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
        </div>

        <p> <strong>APP IS CONSTANTLY UNDER UPDATES AND DEVELOPMENT. FEEL FREE TO SUGGEST ANY CHANGES at: nguyendrew20@gmail.com</strong></p>
        <div>
          <mark>
          <p><strong>Guest email: guest@gmail.com </strong></p>
          <p><strong>Guest password: guest</strong></p>
          </mark>
        </div>
        {/* <div className="lh-copy mt3">
        <p onClick={() => GuestLogRegister(this.props.loadUser,this.props.onRouteChange,'signin', signInEmail, signInPassword, "guest")} className="f6 link dim db pointer pv2">Sign in as Guest</p>
              </div> */}
      </div>
      </main>
      </article>
       );
  }  
}

export default Signin;