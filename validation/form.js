import { useEffect } from "react";

export default function Formvalidation() {
  useEffect(() => {
    const form_button = document.querySelector('#form_submit');
    const form = document.querySelector('#form_test');

    form_button.addEventListener("click", function (e) {
      const name = document.querySelector('#name').value;
      const email = document.querySelector('#email').value;
      let valid = true;

      if (name === '') {
        valid = false;
        alert(valid);
      } else {
        valid = true;
      }

      if (email === '') {
        valid = false;
        alert(valid);
      } else {
        valid = true;
      }

      if (valid === false) {
        e.preventDefault();
      } else {
        form.submit();
        form_button.disabled = true;
      }
    });
  }, []);

  return (
    <>
      <h3>
        Form
      </h3>

      <form method='post' action='/api/form' id='form_test'>
        <div className='mb-3'>
          <label htmlFor="name" className="form-label">Name</label>
          <input type="name" className="form-control" id="name" name='name' />
        </div>

        <div className='mb-3'>
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name='email' />
        </div>

        <button type="button" id="form_submit" className="btn btn-primary">Submit</button>
      </form>
    </>
  )
}