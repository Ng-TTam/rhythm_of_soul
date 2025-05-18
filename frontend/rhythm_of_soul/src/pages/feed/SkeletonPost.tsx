import React from 'react';
import { Card, Placeholder } from 'react-bootstrap';

const SkeletonPost: React.FC = () => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <Placeholder as="div" animation="glow" style={{ width: 40, height: 40, borderRadius: '50%' }} />
          <div className="ms-2">
            <Placeholder as="div" animation="glow">
              <Placeholder xs={4} />
            </Placeholder>
            <Placeholder as="small" animation="glow">
              <Placeholder xs={3} />
            </Placeholder>
          </div>
        </div>
        
        <Placeholder as={Card.Text} animation="glow">
          <Placeholder xs={12} /> 
          <Placeholder xs={8} /> 
          <Placeholder xs={10} />
        </Placeholder>
        
        <div className="d-flex gap-4">
          <Placeholder.Button variant="primary" xs={3} />
          <Placeholder.Button variant="primary" xs={3} />
          <Placeholder.Button variant="primary" xs={3} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default SkeletonPost;