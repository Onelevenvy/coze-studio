// Code generated by thriftgo (0.4.1). DO NOT EDIT.

package common

import (
	"database/sql"
	"database/sql/driver"
	"fmt"
	"github.com/apache/thrift/lib/go/thrift"
)

type ColumnType int64

const (
	ColumnType_Unknown ColumnType = 0
	// 文本
	ColumnType_Text ColumnType = 1
	// 数字
	ColumnType_Number ColumnType = 2
	// 时间
	ColumnType_Date ColumnType = 3
	// float
	ColumnType_Float ColumnType = 4
	// bool
	ColumnType_Boolean ColumnType = 5
	// 图片
	ColumnType_Image ColumnType = 6
)

func (p ColumnType) String() string {
	switch p {
	case ColumnType_Unknown:
		return "Unknown"
	case ColumnType_Text:
		return "Text"
	case ColumnType_Number:
		return "Number"
	case ColumnType_Date:
		return "Date"
	case ColumnType_Float:
		return "Float"
	case ColumnType_Boolean:
		return "Boolean"
	case ColumnType_Image:
		return "Image"
	}
	return "<UNSET>"
}

func ColumnTypeFromString(s string) (ColumnType, error) {
	switch s {
	case "Unknown":
		return ColumnType_Unknown, nil
	case "Text":
		return ColumnType_Text, nil
	case "Number":
		return ColumnType_Number, nil
	case "Date":
		return ColumnType_Date, nil
	case "Float":
		return ColumnType_Float, nil
	case "Boolean":
		return ColumnType_Boolean, nil
	case "Image":
		return ColumnType_Image, nil
	}
	return ColumnType(0), fmt.Errorf("not a valid ColumnType string")
}

func ColumnTypePtr(v ColumnType) *ColumnType { return &v }
func (p *ColumnType) Scan(value interface{}) (err error) {
	var result sql.NullInt64
	err = result.Scan(value)
	*p = ColumnType(result.Int64)
	return
}

func (p *ColumnType) Value() (driver.Value, error) {
	if p == nil {
		return nil, nil
	}
	return int64(*p), nil
}

type DocTableSheet struct {
	// sheet 的编号
	ID int64 `thrift:"id,1" form:"id" json:"id" query:"id"`
	// sheet 名
	SheetName string `thrift:"sheet_name,2" form:"sheet_name" json:"sheet_name" query:"sheet_name"`
	// 总行数
	TotalRow int64 `thrift:"total_row,3" form:"total_row" json:"total_row" query:"total_row"`
}

func NewDocTableSheet() *DocTableSheet {
	return &DocTableSheet{}
}

func (p *DocTableSheet) InitDefault() {
}

func (p *DocTableSheet) GetID() (v int64) {
	return p.ID
}

func (p *DocTableSheet) GetSheetName() (v string) {
	return p.SheetName
}

func (p *DocTableSheet) GetTotalRow() (v int64) {
	return p.TotalRow
}

var fieldIDToName_DocTableSheet = map[int16]string{
	1: "id",
	2: "sheet_name",
	3: "total_row",
}

func (p *DocTableSheet) Read(iprot thrift.TProtocol) (err error) {
	var fieldTypeId thrift.TType
	var fieldId int16

	if _, err = iprot.ReadStructBegin(); err != nil {
		goto ReadStructBeginError
	}

	for {
		_, fieldTypeId, fieldId, err = iprot.ReadFieldBegin()
		if err != nil {
			goto ReadFieldBeginError
		}
		if fieldTypeId == thrift.STOP {
			break
		}

		switch fieldId {
		case 1:
			if fieldTypeId == thrift.I64 {
				if err = p.ReadField1(iprot); err != nil {
					goto ReadFieldError
				}
			} else if err = iprot.Skip(fieldTypeId); err != nil {
				goto SkipFieldError
			}
		case 2:
			if fieldTypeId == thrift.STRING {
				if err = p.ReadField2(iprot); err != nil {
					goto ReadFieldError
				}
			} else if err = iprot.Skip(fieldTypeId); err != nil {
				goto SkipFieldError
			}
		case 3:
			if fieldTypeId == thrift.I64 {
				if err = p.ReadField3(iprot); err != nil {
					goto ReadFieldError
				}
			} else if err = iprot.Skip(fieldTypeId); err != nil {
				goto SkipFieldError
			}
		default:
			if err = iprot.Skip(fieldTypeId); err != nil {
				goto SkipFieldError
			}
		}
		if err = iprot.ReadFieldEnd(); err != nil {
			goto ReadFieldEndError
		}
	}
	if err = iprot.ReadStructEnd(); err != nil {
		goto ReadStructEndError
	}

	return nil
ReadStructBeginError:
	return thrift.PrependError(fmt.Sprintf("%T read struct begin error: ", p), err)
ReadFieldBeginError:
	return thrift.PrependError(fmt.Sprintf("%T read field %d begin error: ", p, fieldId), err)
ReadFieldError:
	return thrift.PrependError(fmt.Sprintf("%T read field %d '%s' error: ", p, fieldId, fieldIDToName_DocTableSheet[fieldId]), err)
SkipFieldError:
	return thrift.PrependError(fmt.Sprintf("%T field %d skip type %d error: ", p, fieldId, fieldTypeId), err)

ReadFieldEndError:
	return thrift.PrependError(fmt.Sprintf("%T read field end error", p), err)
ReadStructEndError:
	return thrift.PrependError(fmt.Sprintf("%T read struct end error: ", p), err)
}

func (p *DocTableSheet) ReadField1(iprot thrift.TProtocol) error {

	var _field int64
	if v, err := iprot.ReadI64(); err != nil {
		return err
	} else {
		_field = v
	}
	p.ID = _field
	return nil
}
func (p *DocTableSheet) ReadField2(iprot thrift.TProtocol) error {

	var _field string
	if v, err := iprot.ReadString(); err != nil {
		return err
	} else {
		_field = v
	}
	p.SheetName = _field
	return nil
}
func (p *DocTableSheet) ReadField3(iprot thrift.TProtocol) error {

	var _field int64
	if v, err := iprot.ReadI64(); err != nil {
		return err
	} else {
		_field = v
	}
	p.TotalRow = _field
	return nil
}

func (p *DocTableSheet) Write(oprot thrift.TProtocol) (err error) {
	var fieldId int16
	if err = oprot.WriteStructBegin("DocTableSheet"); err != nil {
		goto WriteStructBeginError
	}
	if p != nil {
		if err = p.writeField1(oprot); err != nil {
			fieldId = 1
			goto WriteFieldError
		}
		if err = p.writeField2(oprot); err != nil {
			fieldId = 2
			goto WriteFieldError
		}
		if err = p.writeField3(oprot); err != nil {
			fieldId = 3
			goto WriteFieldError
		}
	}
	if err = oprot.WriteFieldStop(); err != nil {
		goto WriteFieldStopError
	}
	if err = oprot.WriteStructEnd(); err != nil {
		goto WriteStructEndError
	}
	return nil
WriteStructBeginError:
	return thrift.PrependError(fmt.Sprintf("%T write struct begin error: ", p), err)
WriteFieldError:
	return thrift.PrependError(fmt.Sprintf("%T write field %d error: ", p, fieldId), err)
WriteFieldStopError:
	return thrift.PrependError(fmt.Sprintf("%T write field stop error: ", p), err)
WriteStructEndError:
	return thrift.PrependError(fmt.Sprintf("%T write struct end error: ", p), err)
}

func (p *DocTableSheet) writeField1(oprot thrift.TProtocol) (err error) {
	if err = oprot.WriteFieldBegin("id", thrift.I64, 1); err != nil {
		goto WriteFieldBeginError
	}
	if err := oprot.WriteI64(p.ID); err != nil {
		return err
	}
	if err = oprot.WriteFieldEnd(); err != nil {
		goto WriteFieldEndError
	}
	return nil
WriteFieldBeginError:
	return thrift.PrependError(fmt.Sprintf("%T write field 1 begin error: ", p), err)
WriteFieldEndError:
	return thrift.PrependError(fmt.Sprintf("%T write field 1 end error: ", p), err)
}
func (p *DocTableSheet) writeField2(oprot thrift.TProtocol) (err error) {
	if err = oprot.WriteFieldBegin("sheet_name", thrift.STRING, 2); err != nil {
		goto WriteFieldBeginError
	}
	if err := oprot.WriteString(p.SheetName); err != nil {
		return err
	}
	if err = oprot.WriteFieldEnd(); err != nil {
		goto WriteFieldEndError
	}
	return nil
WriteFieldBeginError:
	return thrift.PrependError(fmt.Sprintf("%T write field 2 begin error: ", p), err)
WriteFieldEndError:
	return thrift.PrependError(fmt.Sprintf("%T write field 2 end error: ", p), err)
}
func (p *DocTableSheet) writeField3(oprot thrift.TProtocol) (err error) {
	if err = oprot.WriteFieldBegin("total_row", thrift.I64, 3); err != nil {
		goto WriteFieldBeginError
	}
	if err := oprot.WriteI64(p.TotalRow); err != nil {
		return err
	}
	if err = oprot.WriteFieldEnd(); err != nil {
		goto WriteFieldEndError
	}
	return nil
WriteFieldBeginError:
	return thrift.PrependError(fmt.Sprintf("%T write field 3 begin error: ", p), err)
WriteFieldEndError:
	return thrift.PrependError(fmt.Sprintf("%T write field 3 end error: ", p), err)
}

func (p *DocTableSheet) String() string {
	if p == nil {
		return "<nil>"
	}
	return fmt.Sprintf("DocTableSheet(%+v)", *p)

}

// 表格的列信息
type DocTableColumn struct {
	// 列 id
	ID int64 `thrift:"id,1" form:"id" json:"id,string"`
	// 列名
	ColumnName string `thrift:"column_name,2" form:"column_name" json:"column_name" query:"column_name"`
	// 是否为语义匹配列
	IsSemantic bool `thrift:"is_semantic,3" form:"is_semantic" json:"is_semantic" query:"is_semantic"`
	// 列原本在 excel 的序号
	Sequence int64 `thrift:"sequence,4" form:"sequence" json:"sequence,string"`
	// 列类型
	ColumnType         *ColumnType `thrift:"column_type,5,optional" form:"column_type" json:"column_type,omitempty" query:"column_type"`
	ContainsEmptyValue *bool       `thrift:"contains_empty_value,6,optional" form:"contains_empty_value" json:"contains_empty_value,omitempty" query:"contains_empty_value"`
	// 描述
	Desc *string `thrift:"desc,7,optional" form:"desc" json:"desc,omitempty" query:"desc"`
}

func NewDocTableColumn() *DocTableColumn {
	return &DocTableColumn{}
}

func (p *DocTableColumn) InitDefault() {
}

func (p *DocTableColumn) GetID() (v int64) {
	return p.ID
}

func (p *DocTableColumn) GetColumnName() (v string) {
	return p.ColumnName
}

func (p *DocTableColumn) GetIsSemantic() (v bool) {
	return p.IsSemantic
}

func (p *DocTableColumn) GetSequence() (v int64) {
	return p.Sequence
}

var DocTableColumn_ColumnType_DEFAULT ColumnType

func (p *DocTableColumn) GetColumnType() (v ColumnType) {
	if !p.IsSetColumnType() {
		return DocTableColumn_ColumnType_DEFAULT
	}
	return *p.ColumnType
}

var DocTableColumn_ContainsEmptyValue_DEFAULT bool

func (p *DocTableColumn) GetContainsEmptyValue() (v bool) {
	if !p.IsSetContainsEmptyValue() {
		return DocTableColumn_ContainsEmptyValue_DEFAULT
	}
	return *p.ContainsEmptyValue
}

var DocTableColumn_Desc_DEFAULT string

func (p *DocTableColumn) GetDesc() (v string) {
	if !p.IsSetDesc() {
		return DocTableColumn_Desc_DEFAULT
	}
	return *p.Desc
}

var fieldIDToName_DocTableColumn = map[int16]string{
	1: "id",
	2: "column_name",
	3: "is_semantic",
	4: "sequence",
	5: "column_type",
	6: "contains_empty_value",
	7: "desc",
}

func (p *DocTableColumn) IsSetColumnType() bool {
	return p.ColumnType != nil
}

func (p *DocTableColumn) IsSetContainsEmptyValue() bool {
	return p.ContainsEmptyValue != nil
}

func (p *DocTableColumn) IsSetDesc() bool {
	return p.Desc != nil
}

func (p *DocTableColumn) Read(iprot thrift.TProtocol) (err error) {
	var fieldTypeId thrift.TType
	var fieldId int16

	if _, err = iprot.ReadStructBegin(); err != nil {
		goto ReadStructBeginError
	}

	for {
		_, fieldTypeId, fieldId, err = iprot.ReadFieldBegin()
		if err != nil {
			goto ReadFieldBeginError
		}
		if fieldTypeId == thrift.STOP {
			break
		}

		switch fieldId {
		case 1:
			if fieldTypeId == thrift.I64 {
				if err = p.ReadField1(iprot); err != nil {
					goto ReadFieldError
				}
			} else if err = iprot.Skip(fieldTypeId); err != nil {
				goto SkipFieldError
			}
		case 2:
			if fieldTypeId == thrift.STRING {
				if err = p.ReadField2(iprot); err != nil {
					goto ReadFieldError
				}
			} else if err = iprot.Skip(fieldTypeId); err != nil {
				goto SkipFieldError
			}
		case 3:
			if fieldTypeId == thrift.BOOL {
				if err = p.ReadField3(iprot); err != nil {
					goto ReadFieldError
				}
			} else if err = iprot.Skip(fieldTypeId); err != nil {
				goto SkipFieldError
			}
		case 4:
			if fieldTypeId == thrift.I64 {
				if err = p.ReadField4(iprot); err != nil {
					goto ReadFieldError
				}
			} else if err = iprot.Skip(fieldTypeId); err != nil {
				goto SkipFieldError
			}
		case 5:
			if fieldTypeId == thrift.I32 {
				if err = p.ReadField5(iprot); err != nil {
					goto ReadFieldError
				}
			} else if err = iprot.Skip(fieldTypeId); err != nil {
				goto SkipFieldError
			}
		case 6:
			if fieldTypeId == thrift.BOOL {
				if err = p.ReadField6(iprot); err != nil {
					goto ReadFieldError
				}
			} else if err = iprot.Skip(fieldTypeId); err != nil {
				goto SkipFieldError
			}
		case 7:
			if fieldTypeId == thrift.STRING {
				if err = p.ReadField7(iprot); err != nil {
					goto ReadFieldError
				}
			} else if err = iprot.Skip(fieldTypeId); err != nil {
				goto SkipFieldError
			}
		default:
			if err = iprot.Skip(fieldTypeId); err != nil {
				goto SkipFieldError
			}
		}
		if err = iprot.ReadFieldEnd(); err != nil {
			goto ReadFieldEndError
		}
	}
	if err = iprot.ReadStructEnd(); err != nil {
		goto ReadStructEndError
	}

	return nil
ReadStructBeginError:
	return thrift.PrependError(fmt.Sprintf("%T read struct begin error: ", p), err)
ReadFieldBeginError:
	return thrift.PrependError(fmt.Sprintf("%T read field %d begin error: ", p, fieldId), err)
ReadFieldError:
	return thrift.PrependError(fmt.Sprintf("%T read field %d '%s' error: ", p, fieldId, fieldIDToName_DocTableColumn[fieldId]), err)
SkipFieldError:
	return thrift.PrependError(fmt.Sprintf("%T field %d skip type %d error: ", p, fieldId, fieldTypeId), err)

ReadFieldEndError:
	return thrift.PrependError(fmt.Sprintf("%T read field end error", p), err)
ReadStructEndError:
	return thrift.PrependError(fmt.Sprintf("%T read struct end error: ", p), err)
}

func (p *DocTableColumn) ReadField1(iprot thrift.TProtocol) error {

	var _field int64
	if v, err := iprot.ReadI64(); err != nil {
		return err
	} else {
		_field = v
	}
	p.ID = _field
	return nil
}
func (p *DocTableColumn) ReadField2(iprot thrift.TProtocol) error {

	var _field string
	if v, err := iprot.ReadString(); err != nil {
		return err
	} else {
		_field = v
	}
	p.ColumnName = _field
	return nil
}
func (p *DocTableColumn) ReadField3(iprot thrift.TProtocol) error {

	var _field bool
	if v, err := iprot.ReadBool(); err != nil {
		return err
	} else {
		_field = v
	}
	p.IsSemantic = _field
	return nil
}
func (p *DocTableColumn) ReadField4(iprot thrift.TProtocol) error {

	var _field int64
	if v, err := iprot.ReadI64(); err != nil {
		return err
	} else {
		_field = v
	}
	p.Sequence = _field
	return nil
}
func (p *DocTableColumn) ReadField5(iprot thrift.TProtocol) error {

	var _field *ColumnType
	if v, err := iprot.ReadI32(); err != nil {
		return err
	} else {
		tmp := ColumnType(v)
		_field = &tmp
	}
	p.ColumnType = _field
	return nil
}
func (p *DocTableColumn) ReadField6(iprot thrift.TProtocol) error {

	var _field *bool
	if v, err := iprot.ReadBool(); err != nil {
		return err
	} else {
		_field = &v
	}
	p.ContainsEmptyValue = _field
	return nil
}
func (p *DocTableColumn) ReadField7(iprot thrift.TProtocol) error {

	var _field *string
	if v, err := iprot.ReadString(); err != nil {
		return err
	} else {
		_field = &v
	}
	p.Desc = _field
	return nil
}

func (p *DocTableColumn) Write(oprot thrift.TProtocol) (err error) {
	var fieldId int16
	if err = oprot.WriteStructBegin("DocTableColumn"); err != nil {
		goto WriteStructBeginError
	}
	if p != nil {
		if err = p.writeField1(oprot); err != nil {
			fieldId = 1
			goto WriteFieldError
		}
		if err = p.writeField2(oprot); err != nil {
			fieldId = 2
			goto WriteFieldError
		}
		if err = p.writeField3(oprot); err != nil {
			fieldId = 3
			goto WriteFieldError
		}
		if err = p.writeField4(oprot); err != nil {
			fieldId = 4
			goto WriteFieldError
		}
		if err = p.writeField5(oprot); err != nil {
			fieldId = 5
			goto WriteFieldError
		}
		if err = p.writeField6(oprot); err != nil {
			fieldId = 6
			goto WriteFieldError
		}
		if err = p.writeField7(oprot); err != nil {
			fieldId = 7
			goto WriteFieldError
		}
	}
	if err = oprot.WriteFieldStop(); err != nil {
		goto WriteFieldStopError
	}
	if err = oprot.WriteStructEnd(); err != nil {
		goto WriteStructEndError
	}
	return nil
WriteStructBeginError:
	return thrift.PrependError(fmt.Sprintf("%T write struct begin error: ", p), err)
WriteFieldError:
	return thrift.PrependError(fmt.Sprintf("%T write field %d error: ", p, fieldId), err)
WriteFieldStopError:
	return thrift.PrependError(fmt.Sprintf("%T write field stop error: ", p), err)
WriteStructEndError:
	return thrift.PrependError(fmt.Sprintf("%T write struct end error: ", p), err)
}

func (p *DocTableColumn) writeField1(oprot thrift.TProtocol) (err error) {
	if err = oprot.WriteFieldBegin("id", thrift.I64, 1); err != nil {
		goto WriteFieldBeginError
	}
	if err := oprot.WriteI64(p.ID); err != nil {
		return err
	}
	if err = oprot.WriteFieldEnd(); err != nil {
		goto WriteFieldEndError
	}
	return nil
WriteFieldBeginError:
	return thrift.PrependError(fmt.Sprintf("%T write field 1 begin error: ", p), err)
WriteFieldEndError:
	return thrift.PrependError(fmt.Sprintf("%T write field 1 end error: ", p), err)
}
func (p *DocTableColumn) writeField2(oprot thrift.TProtocol) (err error) {
	if err = oprot.WriteFieldBegin("column_name", thrift.STRING, 2); err != nil {
		goto WriteFieldBeginError
	}
	if err := oprot.WriteString(p.ColumnName); err != nil {
		return err
	}
	if err = oprot.WriteFieldEnd(); err != nil {
		goto WriteFieldEndError
	}
	return nil
WriteFieldBeginError:
	return thrift.PrependError(fmt.Sprintf("%T write field 2 begin error: ", p), err)
WriteFieldEndError:
	return thrift.PrependError(fmt.Sprintf("%T write field 2 end error: ", p), err)
}
func (p *DocTableColumn) writeField3(oprot thrift.TProtocol) (err error) {
	if err = oprot.WriteFieldBegin("is_semantic", thrift.BOOL, 3); err != nil {
		goto WriteFieldBeginError
	}
	if err := oprot.WriteBool(p.IsSemantic); err != nil {
		return err
	}
	if err = oprot.WriteFieldEnd(); err != nil {
		goto WriteFieldEndError
	}
	return nil
WriteFieldBeginError:
	return thrift.PrependError(fmt.Sprintf("%T write field 3 begin error: ", p), err)
WriteFieldEndError:
	return thrift.PrependError(fmt.Sprintf("%T write field 3 end error: ", p), err)
}
func (p *DocTableColumn) writeField4(oprot thrift.TProtocol) (err error) {
	if err = oprot.WriteFieldBegin("sequence", thrift.I64, 4); err != nil {
		goto WriteFieldBeginError
	}
	if err := oprot.WriteI64(p.Sequence); err != nil {
		return err
	}
	if err = oprot.WriteFieldEnd(); err != nil {
		goto WriteFieldEndError
	}
	return nil
WriteFieldBeginError:
	return thrift.PrependError(fmt.Sprintf("%T write field 4 begin error: ", p), err)
WriteFieldEndError:
	return thrift.PrependError(fmt.Sprintf("%T write field 4 end error: ", p), err)
}
func (p *DocTableColumn) writeField5(oprot thrift.TProtocol) (err error) {
	if p.IsSetColumnType() {
		if err = oprot.WriteFieldBegin("column_type", thrift.I32, 5); err != nil {
			goto WriteFieldBeginError
		}
		if err := oprot.WriteI32(int32(*p.ColumnType)); err != nil {
			return err
		}
		if err = oprot.WriteFieldEnd(); err != nil {
			goto WriteFieldEndError
		}
	}
	return nil
WriteFieldBeginError:
	return thrift.PrependError(fmt.Sprintf("%T write field 5 begin error: ", p), err)
WriteFieldEndError:
	return thrift.PrependError(fmt.Sprintf("%T write field 5 end error: ", p), err)
}
func (p *DocTableColumn) writeField6(oprot thrift.TProtocol) (err error) {
	if p.IsSetContainsEmptyValue() {
		if err = oprot.WriteFieldBegin("contains_empty_value", thrift.BOOL, 6); err != nil {
			goto WriteFieldBeginError
		}
		if err := oprot.WriteBool(*p.ContainsEmptyValue); err != nil {
			return err
		}
		if err = oprot.WriteFieldEnd(); err != nil {
			goto WriteFieldEndError
		}
	}
	return nil
WriteFieldBeginError:
	return thrift.PrependError(fmt.Sprintf("%T write field 6 begin error: ", p), err)
WriteFieldEndError:
	return thrift.PrependError(fmt.Sprintf("%T write field 6 end error: ", p), err)
}
func (p *DocTableColumn) writeField7(oprot thrift.TProtocol) (err error) {
	if p.IsSetDesc() {
		if err = oprot.WriteFieldBegin("desc", thrift.STRING, 7); err != nil {
			goto WriteFieldBeginError
		}
		if err := oprot.WriteString(*p.Desc); err != nil {
			return err
		}
		if err = oprot.WriteFieldEnd(); err != nil {
			goto WriteFieldEndError
		}
	}
	return nil
WriteFieldBeginError:
	return thrift.PrependError(fmt.Sprintf("%T write field 7 begin error: ", p), err)
WriteFieldEndError:
	return thrift.PrependError(fmt.Sprintf("%T write field 7 end error: ", p), err)
}

func (p *DocTableColumn) String() string {
	if p == nil {
		return "<nil>"
	}
	return fmt.Sprintf("DocTableColumn(%+v)", *p)

}
