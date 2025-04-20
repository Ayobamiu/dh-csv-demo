import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import { Form, Input, Popconfirm, Table, Typography, Tag } from "antd";
import { PatientRecord } from "@/app/utils/types";

interface PatientTableProps {
  data: PatientRecord[];
  onDataUpdate: (newData: PatientRecord[]) => void;
  fileName?: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: "text";
  record: PatientRecord;
  index: number;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  children,
  ...restProps
}) => {
  const inputNode = <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: dataIndex === "ehrId" || dataIndex === "patientName",
              message: `Please input ${title}`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const PatientTable = forwardRef(
  ({ data: initialData, onDataUpdate, fileName }: PatientTableProps, ref) => {
    const [form] = Form.useForm();
    const [data, setData] = useState<PatientRecord[]>([]);

    useEffect(() => {
      setData(
        initialData.map((d) => ({
          ...d,
          isValid: !!(d.ehrId && d.patientName),
          syncStatus: d.syncStatus || "pending",
        }))
      );
    }, [initialData]);

    const [editingKey, setEditingKey] = useState<string>("");

    const isEditing = (record: PatientRecord) => record.ehrId === editingKey;

    const edit = (record: PatientRecord) => {
      form.setFieldsValue({ ...record });
      setEditingKey(record.ehrId);
    };

    const cancel = () => setEditingKey("");

    const save = async (key: string) => {
      try {
        const row = (await form.validateFields()) as PatientRecord;
        const newData = [...data];
        const index = newData.findIndex((item) => item.ehrId === key);

        if (index > -1) {
          const updated: PatientRecord = {
            ...newData[index],
            ...row,
            isValid: !!(row.ehrId && row.patientName),
            syncStatus: "pending",
          };
          newData.splice(index, 1, updated);
          setData(newData);
          onDataUpdate(newData);
          setEditingKey("");
        }
      } catch (err) {
        console.log("Save failed:", err);
      }
    };

    // Expose prepared data for syncing
    useImperativeHandle(ref, () => ({
      getPreparedData: () => data.filter((d) => d.isValid),
    }));

    const columns = [
      {
        title: "EHR ID",
        dataIndex: "ehrId",
        editable: true,
        fixed: "left" as const,
      },
      {
        title: "Patient Name",
        dataIndex: "patientName",
        editable: true,
      },
      {
        title: "Email",
        dataIndex: "email",
        editable: true,
      },
      {
        title: "Phone",
        dataIndex: "phone",
        editable: true,
      },
      {
        title: "Referring Provider",
        dataIndex: "referringProvider",
        editable: true,
      },
      {
        title: "Status",
        dataIndex: "syncStatus",
        render: (_: any, record: PatientRecord) => {
          const colorMap = {
            pending: "orange",
            synced: "green",
            error: "red",
          };
          return (
            <Tag color={colorMap[record.syncStatus || "pending"]}>
              {record.syncStatus?.toUpperCase() || "PENDING"}
            </Tag>
          );
        },
      },
      {
        title: "Action",
        dataIndex: "operation",
        fixed: "right" as const,
        render: (_: any, record: PatientRecord) => {
          const editable = isEditing(record);
          return editable ? (
            <span>
              <Typography.Link
                onClick={() => save(record.ehrId)}
                style={{ marginRight: 8 }}
              >
                Save
              </Typography.Link>
              <Popconfirm title="Cancel changes?" onConfirm={cancel}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              Edit
            </Typography.Link>
          );
        },
      },
    ];

    const mergedColumns = columns.map((col) => {
      if (!col.editable) return col;
      return {
        ...col,
        onCell: (record: PatientRecord) => ({
          record,
          inputType: "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    });

    return (
      <Form form={form} component={false}>
        <Table
          title={() => fileName}
          components={{ body: { cell: EditableCell } }}
          key={"patient-table"}
          rowKey="ehrId"
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName={(record) =>
            !record.isValid ? "editable-row error-row" : "editable-row"
          }
          pagination={{ onChange: cancel }}
          scroll={{ x: "max-content" }}
        />
      </Form>
    );
  }
);

export default PatientTable;
