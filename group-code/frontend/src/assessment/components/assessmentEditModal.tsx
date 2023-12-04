import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message, Radio, DatePicker } from 'antd';
import AssessmentService from '../AssessmentService';
import { RadioChangeEvent } from 'antd/lib/radio';

type AssessmentEditModalType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalType: 'add' | 'edit';
  id?: string | undefined;
  assessmentId?: string | undefined;
};

const AssessmentEditModal = (props: AssessmentEditModalType) => {
  const { RangePicker } = DatePicker;

  const [modalType, setModalType] = useState<'add' | 'edit'>('edit');

  const [messageApi, contextHolder] = message.useMessage();

  const [typeValue, setTypeValue] = useState("")
  const [proportionValue, setProportionValue] = useState("")

  useEffect(() => {
    setModalType(props.modalType);
  }, [props.isOpen]);

  const handleCancel = () => {
    props.setIsOpen(false);
  };
  const handleOk = async (values: any) => {
    const start = values.timeRange[0];
    const end = values.timeRange[1];
    const timeRange = `${start.$y}/${start.$M + 1}/${start.$D} to ${end.$y}/${end.$M + 1
      }/${end.$D}`;
    let params;
    if (props.modalType === 'edit') {
      params = {
        assessment_id: props.assessmentId,
        proportion: values.proportion,
        status: values.status,
        timeRange: timeRange
      };
    } else {
      params = {
        topic_id: props.id,
        type: values.type,
        assessmentName: values.assessmentName,
        proportion: values.proportion,
        status: 'close',
        timeRange: timeRange
      };
    }

    try {
      let res: any;
      if (props.modalType === 'edit') {
        res = await AssessmentService.updateAssessmentArribute(params);
      } else {
        res = await AssessmentService.addNewAssessment(params);
      }
      props.setIsOpen(false);
      alert('success');
      window.location.reload();
    } catch (err) {
      messageApi.open({
        type: 'error',
        content: 'Submission failed.'
      });
    }
  };

  const handleProportionValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProportionValue(e.target.value)
  }

  return (
    <>
      <Modal
        title="Title"
        open={props.isOpen}
        footer={[]}
        onCancel={handleCancel}
      >
        {contextHolder}
        <Form
          name="edit"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          autoComplete="off"
          onFinish={handleOk}
        >
          {modalType === 'add' && (
            <Form.Item
              name="assessmentName"
              label="Name"
              rules={[
                { required: true, message: 'Please fill assessment name' }
              ]}
            >
              <Input placeholder="Please fill assessment name" />
            </Form.Item>
          )}
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please select type' }]}
          >
            <Radio.Group value={typeValue}>
              <Radio.Button value="exam">Exam</Radio.Button>
              <Radio.Button value="assignment">Assignment</Radio.Button>
              <Radio.Button value="quiz">Quiz</Radio.Button>
              <Radio.Button value="essay">Essay</Radio.Button>
            </Radio.Group>
          </Form.Item>
          {modalType === 'edit' && (
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status' }]}
            >
              <Radio.Group>
                <Radio.Button value="open" >Open</Radio.Button>
                <Radio.Button value="close">Close</Radio.Button>
              </Radio.Group>
            </Form.Item>
          )}
          <Form.Item
            name="proportion"
            label="Proportion"
            rules={[
              {
                required: true,
                message: 'Please fill proportion'
              },
              {
                pattern: new RegExp(/^(0(\.\d+)?|1)$/g),
                message: 'wrong format'
              }
            ]}
          >
            <Input placeholder="Enter a number between 0 and 1. Example: 0.2" value={parseInt(proportionValue)} onChange={handleProportionValue} />
          </Form.Item>
          <Form.Item
            name="timeRange"
            label="Time range"
            rules={[{ required: true, message: 'Please select range' }]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: 'rgb(79 70 229)', marginRight: '10px' }}
            >
              Submit
            </Button>
            <Button htmlType="button" onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AssessmentEditModal;
