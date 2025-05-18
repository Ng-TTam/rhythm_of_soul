import React from 'react';

export default function AddSong() {
  return (
    <>
      <div>
        <div className="offcanvas-header">
          <h4 id="offcanvassongLabel">Add Song</h4>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>

        <div className="offcanvas-body">
          <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            console.log('Submit form');
            // Add form handling logic here
          }}>
            <div className="mb-3">
              <label htmlFor="esongname" className="form-label">Song Name:</label>
              <input
                type="text"
                className="form-control"
                id="esongname"
                placeholder="Enter song name"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="customFile1" className="form-label">Singer Profile:</label>
              <input
                className="form-control"
                type="file"
                id="customFile1"
              />
            </div>

            <div className="mb-3">
              <label>Song Category:</label>
              <select className="form-select" aria-label="Select category">
                <option selected disabled>Song Category</option>
                <option value="pop">Pop</option>
                <option value="rock">Rock</option>
                <option value="hiphop">Hip-hop</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Song Writer:</label>
              <select className="form-select" aria-label="Select writer">
                <option selected disabled>Song Writer</option>
                <option value="writer1">Writer 1</option>
                <option value="writer2">Writer 2</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Song Singer:</label>
              <select className="form-select" aria-label="Select singer">
                <option selected disabled>Song Singer</option>
                <option value="singer1">Singer 1</option>
                <option value="singer2">Singer 2</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="writerdescription" className="form-label">Writer Description:</label>
              <textarea
                className="form-control"
                id="writerdescription"
                rows={5}
              />
            </div>

            <button type="submit" className="btn btn-primary">Submit</button>
            <button type="reset" className="btn btn-danger ms-2">Reset</button>
          </form>
        </div>
      </div>
    </>
  );
}
