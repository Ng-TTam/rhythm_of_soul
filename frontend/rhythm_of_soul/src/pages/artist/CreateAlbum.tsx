import React from 'react'
import ListSongs from '../../components/songs/ListSongs'

export default function CreateAlbum() {
    const songs = [
        {
          id: 1,
          image: '/assets/images/dashboard/14.png',
          name: 'Heart Is Beating',
          genre: 'Romantic Song',
          writer: 'Edyta Gorniak',
          singer: 'Jhone Steben',
          listener: '4.6k',
          reviews: 12,
        },
      ];
    return (
        <>
            <div>
                <div className="offcanvas-header">
                    <h4 id="offcanvassongLabel">Create Album</h4>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
                </div>
                <div className="offcanvas-body">
                    <form action="https://templates.iqonic.design/muzik/html/dashboard/admin/admin-song.html">
                        <div className="mb-3">
                            <label htmlFor="esongname" className="form-label">Album Name:</label>
                            <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="customFile1" className="form-label custom-file-input">Singer Profile:</label>
                            <input className="form-control" type="file" id="customFile1" />
                        </div>
                        <div className="mb-3">
                            <label>Album Category:</label>
                            <select className="form-select" aria-label="exampleone">
                                <option selected disabled>Song Category</option>
                                <option>Filmi Song</option>
                                <option>Surf Song</option>
                                <option>Sed Song</option>
                                <option>Falling Song</option>
                                <option>Rock songs</option>
                                <option>Torch song</option>
                                <option>Filmi Song</option>
                                <option>Gospel song</option>
                                <option>Carnival song</option>
                                <option>Jazz songs‎</option>
                            </select>
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="writerdescription" className="form-label">Album Description:</label>
                            <textarea className="form-control" id="writerdescription" rows={5} defaultValue={""} />
                        </div>
                        <ListSongs songs={songs} />;

                        <button type="submit" className="btn btn-primary">Submit</button>
                        <button type="reset" className="btn btn-danger">Reset</button>
                    </form>
                </div>
            </div>
            
        </>
    )
}
